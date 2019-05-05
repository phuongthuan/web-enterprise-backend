
module.exports = app => {
  app.post('/api/downloads', (req, res, next) => {
    console.log(req.body.fileUrl);
    const filePath = req.body.fileUrl;
    const fileName = "salesReport.pdf"; // file name 
    res.download(filePath, fileName);
  });
}