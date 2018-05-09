const express = require('express');
const router = express.Router();

var snmp = require ("../");
var target = '10.32.21.206';
var community = 'public';
var ObjectType = {
	1: "Boolean",
	2: "Integer",
	4: "OctetString",
	5: "Null",
	6: "OID",
	64: "IpAddress",
	65: "Counter",
	66: "Gauge",
	67: "TimeTicks",
	68: "Opaque",
	70: "Counter64",
	128: "NoSuchObject",
	129: "NoSuchInstance",
	130: "EndOfMibView"
};

router.get('/get/:oid', function (req, res) {

    var version = 0;
    var oids = [req.params.oid];

    var session = snmp.createSession (target, community, {version: version});

    session.get (oids, function (error, varbinds) {
        if (error) {
            res.send (error.toString ());
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError (varbinds[i]))
                    res.send (snmp.varbindError (varbinds[i]));
                else
                    res.json ({oid : varbinds[i].oid, value : varbinds[i].value.toString(), type : ObjectType[varbinds[i].type]});
            }
        }
    });
});

router.get('/getnext/:oid', function (req, res) {

    var version = 0;
    var oids = [req.params.oid];

    var session = snmp.createSession (target, community, {version: version});

    session.getNext (oids, function (error, varbinds) {
        if (error) {
            res.send (error.toString ());
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError (varbinds[i]))
                    res.send (snmp.varbindError (varbinds[i]));
                else
                    res.json ({oid : varbinds[i].oid, value : varbinds[i].value.toString(), type : ObjectType[varbinds[i].type]});
            }
        }
    });
});

router.get('/getbulk/:n/:m/:oid1/:oid2', function (req, res) {

    var nonRepeaters = 1;
    var maxRepetitions = 3;
    
    var oids = [req.params.oid1, req.params.oid2];
    
    var options = 1;

    var content = "";

    var session = snmp.createSession (target, community, options);

    session.getBulk (oids, nonRepeaters, maxRepetitions, function (error,
            varbinds) {
        if (error) {
            res.send (error.toString ());
        } else {
            // step through the non-repeaters which are single varbinds
            for (var i = 0; i < nonRepeaters; i++) {
                if (i >= varbinds.length)
                    break;
                
                if (snmp.isVarbindError (varbinds[i]))
                    res.send (snmp.varbindError (varbinds[i]));
                else
                    content += ('{"oid" : "' + varbinds[i].oid +'", "value" : "' + varbinds[i].value + '", "type" : "' + ObjectType[varbinds[i].type] + '"},');
            }
            
            // then step through the repeaters which are varbind arrays
            for (var i = nonRepeaters; i < varbinds.length; i++) {
                for (var j = 0; j < varbinds[i].length; j++) {
                    if (snmp.isVarbindError (varbinds[i][j]))
                        res.send (snmp.varbindError (varbinds[i][j]));
                    else
                    content += ('{"oid" : "' + varbinds[i][j].oid +'", "value" : "' + varbinds[i][j].value + '", "type" : "' + ObjectType[varbinds[i][j].type] + '"},');
                }
            };
            content = "[" + content + "]";
            res.send(JSON.parse(content.replace(",]", "]")));
        }
    });
});

router.put('/set/:oid/:type/:value', function (req, res) {
    var ty;

    for (var t in ObjectType) {
        if (ObjectType[t] == req.params.type)
            ty = t;
    }

    var version = 0;

    var varbinds = [{
        oid: req.params.oid,
        type: ty,
        value: req.params.value
    }];

    var session = snmp.createSession (target, community, {version: version});

    session.set (varbinds, function (error, varbinds) {
        if (error) {
            res.send (error.toString ());
        } else {
            for (var i = 0; i < varbinds.length; i++)
                res.json ({oid : varbinds[i].oid, value : varbinds[i].value.toString(), type : ObjectType[varbinds[i].type]});
        }
    });
});

router.get('/walk/:oid', function (req, res) {

    var version = 0;
    var oid = req.params.oid;

    var session = snmp.createSession (target, community, {version: version});

    var content = "";

    function doneCb (error) {
        if (error)
            console.error (error.toString ());
        content = "[" + content + "]";
        res.send(JSON.parse(content.replace(",]", "]")));
    }

    function feedCb (varbinds) {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]));
            else 
                content += '{"oid" : "' + varbinds[i].oid +'", "value" : "' + varbinds[i].value + '", "type" : "' + ObjectType[varbinds[i].type] + '"},';         
        }
    }

    var maxRepetitions = 20;
    session.walk (oid, maxRepetitions, feedCb, doneCb);

});

router.get('/subtree/:oid', function (req, res) {

    var version = 0;
    var oid = req.params.oid;

    var session = snmp.createSession (target, community, {version: version});

    var content = "";
    
    function doneCb (error) {
        if (error)
            console.error (error.toString ());
        content = "[" + content + "]";
        res.send(JSON.parse(content.replace(",]", "]")));
    }

    function feedCb (varbinds) {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]));
            else
                content += '{"oid" : "' + varbinds[i].oid +'", "value" : "' + varbinds[i].value + '", "type" : "' + ObjectType[varbinds[i].type] + '"},';         
        
        }
    }

    var maxRepetitions = 20;
    session.subtree (oid, maxRepetitions, feedCb, doneCb);

});
  
module.exports = router;
