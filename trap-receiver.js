/*
SNMP Trap Receiver

*/

var snmp = require('snmpjs');
var bunyan = require('bunyan');
var util = require('util');
var fs = require('fs');

var options = {
    addr: '192.168.137.228',
    port: 12345,
    family: 'udp4',
};

var log = new bunyan({ name: 'snmpd', level: 'trace'});

var trapd = snmp.createTrapListener({log: log});

trapd.on('trap',function(msg) {
    var data = JSON.stringify(snmp.message.serializer(msg));  
    fs.writeFileSync('t.json', data);  
    console.log(util.inspect(snmp.message.serializer(msg), false, null));
});

trapd.bind(options);
