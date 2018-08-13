const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
var snmp = require('snmpjs');
var bunyan = require('bunyan');
var util = require('util');
var Trap = require('./models/trap');
var dateTime = require('node-datetime');
var winston = require('winston');

// set up express app
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//connect to MongoDB
mongoose.connect('mongodb://localhost/rest_snmp');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

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

app.get('/parameters', function(req, res){
  res.sendFile(__dirname + '/web/parameters.html');
});

app.get('/service', function(req, res){
  res.sendFile(__dirname + '/web/service.html');
});

app.get('/traps', function(req, res){
  res.sendFile(__dirname + '/web/traps.html');
});

app.get('/graph', function(req, res){
  res.sendFile(__dirname + '/web/graph.html');
});

app.get('/task', function(req, res){
  res.sendFile(__dirname + '/web/task.html');
});

//error handling middleware
app.use(function (err, req, res, next) {
  // console.log(err);
  res.status(422).send({error:err.message});
});

var options = {
  addr: '163.22.32.174',
  port: 161,
  family: 'udp4'
};


var log = new bunyan({ name: 'snmpd', level: 'trace'});

var trapd = snmp.createTrapListener({log: log});

trapd.on('trap',function(msg) {
  msg.snmpmsg = snmpmsgSerializer(msg.snmpmsg);
  io.emit('chat message', util.inspect(snmp.message.serializer(msg), false, null));
  var dt = dateTime.create();
  var formatted = dt.format('Y-m-d H:M:S'); 
  var traps = snmp.message.serializer(msg).pdu.varbinds;
  for (let object of traps) {
      var trapData = {
          version : snmp.message.serializer(msg).version,
          community : snmp.message.serializer(msg).community,
          time : formatted,
          pdu : {
              op : snmp.message.serializer(msg).pdu.op,
              enterprise : snmp.message.serializer(msg).pdu.enterprise,
              agent_addr : snmp.message.serializer(msg).pdu.agent_addr,
              generic_trap : snmp.message.serializer(msg).pdu.generic_trap,
              specific_trap : snmp.message.serializer(msg).pdu.specific_trap,
              time_stamp : snmp.message.serializer(msg).pdu.time_stamp,
              varbinds : {
                  oid : object.oid,
                  typename : object.typename,
                  value : object.value,
                  string_value : object.string_value 
              }
          }      
      }      
      trapcreate(trapData);    
    }
});

function snmpmsgSerializer(snmpmsg) {
  // Guard against foo be null/undefined. Check that expected fields
  // are defined.
  if (!snmpmsg)
      return snmpmsg;
  var obj = {
      // Create the object to be logged.
      snmpmsg: 'snmpmsg'
  }
  return obj;
};

function trapcreate(trapData) {
  Trap.create(trapData, function (error, trap) {
      if (error) {
          console.log(error);
      } else {
          console.log(trapData);
      }
  });
}

trapd.bind(options);

//listen for requests
http.listen(process.env.port || 4000, function () {
  console.log('now listening for requests');
});
