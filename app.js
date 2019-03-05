require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json());

require('./routes/upload-file')(app);

// Start server
const port = 5000 || process.env.PORT
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
