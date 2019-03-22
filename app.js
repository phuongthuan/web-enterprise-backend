require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const db = require('./config/keys').mongoURI;

const app = express();

app.use(cors());
app.use(express.json());

// Connect to Mongo
mongoose
  .connect(db, { 
    useNewUrlParser: true,
    useCreateIndex: true
  }) // Adding new mongo url parser
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

  
  // Routes
require('./routes/api/auth')(app);
require('./routes/api/posts')(app);
require('./routes/api/topics')(app);
require('./routes/api/users')(app);
require('./routes/api/upload-file')(app);


// Start server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
