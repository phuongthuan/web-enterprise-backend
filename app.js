require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express()

app.use(express.json())

// Connect to Mongo
mongoose
  .connect('mongodb+srv://npt:npt123456@cluster0-cehiu.mongodb.net/wep-database?retryWrites=true', { 
    useNewUrlParser: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  
  // Routes
app.use('/api/posts', require('./routes/api/posts'));
require('./routes/api/upload-file')(app);


// Start server
const port = 5000 || process.env.PORT
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
