/*
SNMP Trap Receiver

*/

var snmp = require('snmpjs');
var bunyan = require('bunyan');
var util = require('util');
var mongoose = require('mongoose');
var Trap = require('./models/trap'); 

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

trapd.on('trap',function(msg) {
    // var data = JSON.stringify(snmp.message.serializer(msg)); 
    
    var traps = snmp.message.serializer(msg).pdu.varbinds;
    for (let object of traps) {

        var trapData = {
            version : snmp.message.serializer(msg).version,
            community : snmp.message.serializer(msg).community,
            op : snmp.message.serializer(msg).pdu.op,
            enterprise : snmp.message.serializer(msg).pdu.enterprise,
            agent_addr : snmp.message.serializer(msg).pdu.agent_addr,
            generic_trap : snmp.message.serializer(msg).pdu.generic_trap,
            specific_trap : snmp.message.serializer(msg).pdu.specific_trap,
            time_stamp : snmp.message.serializer(msg).pdu.time_stamp,
            oid : object.oid,
            typename : object.typename,
            value : object.value,
            enterpstring_valuerise : object.string_value        
        }
        
        trapcreate(trapData);                    
    }
});

function trapcreate(trapData) {
    Trap.create(trapData, function (error, trap) {
        if (error) {
            console.log(error);
        } else {
            // console.log(util.inspect(snmp.message.serializer(msg), false, null, true)); 
            console.log(trapData);
        }
    });
}

trapd.bind(options);
