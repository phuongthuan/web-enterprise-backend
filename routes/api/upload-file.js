const aws = require('aws-sdk')
const logger = require('../../logger')
const multer = require('multer');
const multerS3 = require('multer-s3');

const secretAccessKey = require('../../config/keys').secretAccessKey;
const accessKeyId = require('../../config/keys').accessKeyId;
const region = require('../../config/keys').region;

aws.config.update({
  secretAccessKey,
  accessKeyId,
  region
});

const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
      s3: s3,
      bucket: 'web-enterprise-s3',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      acl: 'public-read',
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        console.log(file);
        cb(null, Date.now().toString());
      }
  })
}); 

module.exports = app => {
  app.post('/api/upload-file', upload.single('image'), (req, res, next) => {
    logger.debug('request: ', req.file)

    return res.status(200).json({ fileUrl: req.file.location });
  })
}
