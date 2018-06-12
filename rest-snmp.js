const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

//connect to MongoDB
mongoose.connect('mongodb://localhost/rest_snmp');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

// set up express app
const app = express();

//use sessions for tracking logins
app.use(session({
  secret: 'ip community',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(cors({
	methods: ['GET', 'POST', 'PATCH', 'OPTION', 'DELETE'],
	credentials: true,
	origin: true
}));

//use body-parser middleware
app.use(bodyParser.json());

//initialize routes
app.use('/', require('./routes/api'));

// serve static files from template
app.use(express.static(__dirname + '/'));

//error handling middleware
app.use(function (err, req, res, next) {
  // console.log(err);
  res.status(422).send({error:err.message});
});

//listen for requests
app.listen(process.env.port || 4000, function () {
  console.log('now listening for requests');
});
