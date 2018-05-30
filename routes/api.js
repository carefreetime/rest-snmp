const express = require('express');
const router = express.Router();
var Ipcommunity = require('../models/ipcommunity'); 
var mongoose = require('mongoose');
//connect to MongoDB
var db = mongoose.connection;

var snmp = require ("../");

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

function timeticks_conversion (timeticks) {
    var d = Math.floor(timeticks / 8640000);
    var h = Math.floor((timeticks - 8640000 * d) / 360000);
    var m = Math.floor((timeticks - 8640000 * d - 360000 * h) / 6000);
    var s = Math.floor((timeticks - 8640000 * d - 360000 * h - 6000 * m) / 100);
    return (d+':'+h+':'+m+':'+s);
}

router.post('/:ip/:community', function (req, res, next) {   
    var ipcommunityData = {
        ip: req.params.ip,
        community: req.params.community
    }

    Ipcommunity.create(ipcommunityData, function (error, ipcommunity) {
        if (error) {
            return next(error);
        } else {
            req.session.ip = req.params.ip;
            req.session.community = req.params.community;
            return res.redirect('/');
        }
    });
})

router.get('/delete', function (req, res) {
    var ip = req.session.ip;
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
        if (err) {
            return next(err);
        } else {
            db.collection('ipcommunities').remove({'ip' : ip});
            return res.redirect('/');
        }
        });
    }
})

router.get('/get/:oid', function (req, res) {
    var target = req.session.ip;
    var community = req.session.community;

    if (req.session.ip == null || req.session.community == null) {
        return res.redirect('/');
    }

    var version = 0;
    var oids = [req.params.oid];

    var session = snmp.createSession (target, community, {version: version});

    session.get (oids, function (error, varbinds) {
        if (error) {
            res.json (error);
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError (varbinds[i]))
                    res.send (snmp.varbindError (varbinds[i]));
                else {
                    if (varbinds[i].type == 67) {
                        res.json ({oid : varbinds[i].oid, value : timeticks_conversion(varbinds[i].value.toString()), type : ObjectType[varbinds[i].type]});
                    } else {
                        res.json ({oid : varbinds[i].oid, value : varbinds[i].value.toString(), type : ObjectType[varbinds[i].type]});
                    }
                }
            }
        }
    });
});

router.get('/getnext/:oid', function (req, res) {
    var target = req.session.ip;
    var community = req.session.community;

    if (req.session.ip == null || req.session.community == null) {
        return res.redirect('/');
    }

    var version = 0;
    var oids = [req.params.oid];

    var session = snmp.createSession (target, community, {version: version});

    session.getNext (oids, function (error, varbinds) {
        if (error) {
            res.json (error);
        } else {
            for (var i = 0; i < varbinds.length; i++) {
                if (snmp.isVarbindError (varbinds[i]))
                    res.send (snmp.varbindError (varbinds[i]));
                else {
                    if (varbinds[i].type == 67) {
                        res.json ({oid : varbinds[i].oid, value : timeticks_conversion(varbinds[i].value.toString()), type : ObjectType[varbinds[i].type]});
                    } else {
                        res.json ({oid : varbinds[i].oid, value : varbinds[i].value.toString(), type : ObjectType[varbinds[i].type]});
                    }
                }
            }
        }
    });
});

router.get('/getbulk/:n/:m/:oids', function (req, res) {
    var target = req.session.ip;
    var community = req.session.community;

    if (req.session.ip == null || req.session.community == null) {
        return res.redirect('/');
    }

    var nonRepeaters = parseInt(req.params.n);
    var maxRepetitions = parseInt(req.params.m);

    var s = req.params.oids;
    var oids = s.split(",");
    
    var options = 1;

    var content = "";

    var session = snmp.createSession (target, community, options);

    session.getBulk (oids, nonRepeaters, maxRepetitions, function (error,
            varbinds) {
        if (error) {
            res.json (error);
        } else {
            // step through the non-repeaters which are single varbinds
            for (var i = 0; i < nonRepeaters; i++) {
                if (i >= varbinds.length)
                    break;
                
                if (snmp.isVarbindError (varbinds[i]))
                    res.send (snmp.varbindError (varbinds[i]));
                else {
                    if (varbinds[i].type == 67) {
                        content += ('{"oid" : "' + varbinds[i].oid +'", "value" : "' +  timeticks_conversion(varbinds[i].value.toString()) + '", "type" : "' + ObjectType[varbinds[i].type] + '"},');
                    } else {
                        content += ('{"oid" : "' + varbinds[i].oid +'", "value" : "' + varbinds[i].value.toString() + '", "type" : "' + ObjectType[varbinds[i].type] + '"},');
                    }
                }
            }
            
            // then step through the repeaters which are varbind arrays
            for (var i = nonRepeaters; i < varbinds.length; i++) {
                for (var j = 0; j < varbinds[i].length; j++) {
                    if (snmp.isVarbindError (varbinds[i][j]))
                        res.send (snmp.varbindError (varbinds[i][j]));
                        else {
                            if (varbinds[i].type == 67) {
                                content += ('{"oid" : "' + varbinds[i][j].oid +'", "value" : "' +  timeticks_conversion(varbinds[i][j].value.toString()) + '", "type" : "' + ObjectType[varbinds[i][j].type] + '"},');
                            } else {
                                content += ('{"oid" : "' + varbinds[i][j].oid +'", "value" : "' + varbinds[i][j].value.toString() + '", "type" : "' + ObjectType[varbinds[i][j].type] + '"},');
                            }
                        }
                    }
            };
            content = "[" + content + "]";
            res.send(JSON.parse(content.replace(",]", "]")));
        }
    });
});

router.put('/set/:oid/:type/:value', function (req, res) {
    var target = req.session.ip;
    var community = req.session.community;

    if (req.session.ip == null || req.session.community == null) {
        return res.redirect('/');
    }

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
            res.json (error);
        } else {
            for (var i = 0; i < varbinds.length; i++)
                res.json ({oid : varbinds[i].oid, value : varbinds[i].value.toString(), type : ObjectType[varbinds[i].type]});
        }
    });
});

router.get('/walk/:oid', function (req, res) {
    var target = req.session.ip;
    var community = req.session.community;

    if (req.session.ip == null || req.session.community == null) {
        return res.redirect('/');
    }

    var version = 0;
    var oid = req.params.oid;

    var session = snmp.createSession (target, community, {version: version});

    var content = "";

    function doneCb (error) {
        if (error) {
            res.json (error);
        }   
        content = "[" + content + "]";
        content = content.replace(",]", "]");
        res.json(JSON.parse(content));
    }

    function feedCb (varbinds) {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]));
            else {
                if (varbinds[i].value == 67) {
                    content += '{"oid" : "' + varbinds[i].oid +'", "value" : ' + timeticks_conversion(varbinds[i].value.toString()) + ', "type" : "' + ObjectType[varbinds[i].type] + '"},';        
                } else {
                    content += '{"oid" : "' + varbinds[i].oid +'", "value" : ' + JSON.stringify(varbinds[i].value.toString()) + ', "type" : "' + ObjectType[varbinds[i].type] + '"},';                         }
            }
        }
    }

    var maxRepetitions = 20;
    session.walk (oid, maxRepetitions, feedCb, doneCb);

});

router.get('/subtree/:oid', function (req, res) {
    var target = req.session.ip;
    var community = req.session.community;

    if (req.session.ip == null || req.session.community == null) {
        return res.redirect('/');
    }
    
    var version = 0;
    var oid = req.params.oid;

    var session = snmp.createSession (target, community, {version: version});

    var content = "";
    
    function doneCb (error) {
        if (error) {
            res.json (error);
        }            
        content = "[" + content + "]";
        content = content.replace(",]", "]");
        res.json(JSON.parse(content));
    }

    function feedCb (varbinds) {
        for (var i = 0; i < varbinds.length; i++) {
            if (snmp.isVarbindError (varbinds[i]))
                console.error (snmp.varbindError (varbinds[i]));
            else {
                if (varbinds[i].value == 67) {
                    content += '{"oid" : "' + varbinds[i].oid +'", "value" : ' + timeticks_conversion(varbinds[i].value.toString()) + ', "type" : "' + ObjectType[varbinds[i].type] + '"},';        
                } else {
                    content += '{"oid" : "' + varbinds[i].oid +'", "value" : ' + JSON.stringify(varbinds[i].value.toString()) + ', "type" : "' + ObjectType[varbinds[i].type] + '"},';                         }
            }
        
        }
    }

    var maxRepetitions = 20;
    session.subtree (oid, maxRepetitions, feedCb, doneCb);

});
  
module.exports = router;
