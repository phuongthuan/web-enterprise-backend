const aws = require('aws-sdk')
const logger = require('../logger')

const s3 = new aws.S3({
  secretAccessKey: process.env.Secret_Access_Key,
  accessKeyId: process.env.Access_Key_ID,
  region: 'ap-southeast-1'
})

module.exports = app => {
  app.post('/s3-upload-url', (req, res) => {
    logger.debug('request: ', req.body)
    const uuid = Date.now().toString()

    const url = s3.getSignedUrl('putObject', {
      Bucket: 'web-enterprise-s3',
      ACL: 'public-read',
      Key: uuid,
      Expires: 300000,
      ContentType: req.body.contentType,
    })

    const urlS3 = `https://web-enterprise-s3.s3.ap-southeast-1.amazonaws.com/${uuid}`
    return res.json({ 'url': url, 'urlS3': urlS3 })
  })
}
