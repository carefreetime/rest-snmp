const express = require('express');
const bodyParser = require('body-parser');
// set up express app
const app = express();

//use body-parser middleware
app.use(bodyParser.json());

//initialize routes
app.use('/', require('./routes/api'));

//error handling middleware
app.use(function (err, req, res, next) {
  // console.log(err);
  res.status(422).send({error:err.message});
});

//listen for requests
app.listen(process.env.port || 4000, function () {
  console.log('now listening for requests');
});
