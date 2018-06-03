var snmp = require('snmpjs');
var bunyan = require('bunyan');
var util = require('util');
var mongoose = require('mongoose');
var Trap = require('./models/trap');
var dateTime = require('node-datetime'); 

const express = require('express');
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

var options = {
    addr: '163.22.32.174',
    port: 12345,
    family: 'udp4',
};

var log = new bunyan({ name: 'snmpd', level: 'trace'});

var trapd = snmp.createTrapListener({log: log});

var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');

trapd.on('trap',function(msg) {
    io.emit('chat message', util.inspect(snmp.message.serializer(msg), false, null));
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

http.listen(3000, function(){
    console.log('listening on *:3000');
});
