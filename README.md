SNMP API docs
===
**實驗設備**
- IP : `10.32.21.206`
- Community : `public`

測試用 API Server
- `http://163.22.32.174:4000`

## Data Model


### ObjectType
```javascript=
{
    "oid" : (string),
    "object_type" : (number 1, 2, 4, 5, 6, 64, 65, 66, 676, 68, 70, 128, 129, 130), 
    "value" : (string)
}
```

### TrapType
```javascript=
{
    "enterprise" : (string),
    "agent_addr" : (string),
    "generic_trap" : (number 0, 1, 2, 3, 4, 5, 6),
    "specific_trap" : (number),
    "time_stamp" : (number),
    "varbinds" : [
        {
            "oid" : (string),
            "typename" : (string),
            "value" : (string)
        }
    ]
}
```

### 功能
* Get
* GetNext
* GetBulk
* Set
***
* Walk
* GetSubTree
***
* GetTrap


## API

### Get
**GetRequest**
Get `/get/:oid`
http://163.22.32.174:4000/get/1.3.6.1.2.1.1.5.0

#### Request
none

#### Response
##### 200(ok)
Varbind

**範例**
Get `/get/1.3.6.1.2.1.1.5.0`
```javascript=
{
    "oid" : "1.3.6.1.2.1.1.5.0",
    "object_type" : "4",
    "value" : "B11-PC"
}
```

### GetNext
**GetNextRequest**
Get `/getnext/:oid`
http://163.22.32.174:4000/getnext/1.3.6.1.3

#### Request
none

#### Response
##### 200(ok)
Varbinds

**範例**
Get `/getnext/1.3.6.1.3`
```javascript=
{
    "oid" : "1.3.6.1.4.1.77.1.1.1.0",
    "object_type" : "4",
    "value" : "6"
}
```

### GetBulk
**GetBulkRequest**
Get `/getbulk/:n/:m/:oids`
http://163.22.32.174:4000/getbulk/1/3/1.3.6.1.2.1.1.1,1.3.6.1.2.1.1.5

#### Request
none

#### Response
##### 200(ok)
Varbinds

**範例**
Get `/getbulk/1/3/1.3.6.1.2.1.1.1,1.3.6.1.2.1.1.5`
```javascript=
[
    {
        "oid": "1.3.6.1.2.1.1.1.0",
        "value": "Hardware: Intel64 Family 6 Model 37 Stepping 5 AT/AT COMPATIBLE - Software: Windows Version 6.1 (Build 7601 Multiprocessor Free)",
        "type": "OctetString"
    },
    {
        "oid": "1.3.6.1.2.1.1.5.0",
        "value": "B11-PC",
        "type": "OctetString"
    },
    {
        "oid": "1.3.6.1.2.1.1.6.0",
        "value": "B11",
        "type": "OctetString"
    },
    {
        "oid": "1.3.6.1.2.1.1.7.0",
        "value": "76",
        "type": "Integer"
    }
]
```

### Set
**SetRequest**
Put `/set/:oid/:type/:value`
http://163.22.32.174:4000/set/1.3.6.1.2.1.1.6.0/OctetString/B123456

#### Request
```javascript=
{
    "oid" : (string),
    "object_type" : (number 1, 2, 4, 5, 6, 64, 65, 66, 676, 68, 70, 128, 129, 130), 
    "value" : (string)
}
```

#### Response
##### 200(ok)
Varbinds

**範例**
Put  `set/1.3.6.1.2.1.1.6`
```javascript=
{
    "oid" : "1.3.6.1.2.1.1.6.0",
    "object_type" : "4",
    "value" : "B123456"
}
```

### Subtree
Get `/subtree/:oid`
http://163.22.32.174:4000/subtree/1.3.6.1.4.1.77.1.1

#### Request
none

#### Response
##### 200(ok)
Varbind

**範例**
Get `/subtree`
```javascript=
[
    {
        "oid": "1.3.6.1.4.1.77.1.1.1.0",
        "value": "6",
        "type": "OctetString"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.1.2.0",
        "value": "1",
        "type": "OctetString"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.1.3.0",
        "value": "\u0003\u0000\u0000\u0000",
        "type": "OctetString"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.1.4.0",
        "value": "1525812993",
        "type": "Integer"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.1.5.0",
        "value": "1147",
        "type": "Counter"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.1.6.0",
        "value": "0",
        "type": "Counter"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.1.7.0",
        "value": "0",
        "type": "Counter"
    }
]
```

### Walk
**Walk**
Get `/walk/:oid`
http://163.22.32.174:4000/walk/1.3.6.1.4.1.77

#### Request
none

#### Response
##### 200(ok)
Varbind

**範例**
Get `/walk`
```javascript=
[
    {
        "oid": "1.3.6.1.4.1.77.1.1.1.0",
        "value": "6",
        "type": "OctetString"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.1.2.0",
        "value": "1",
        "type": "OctetString"
    },
    .
    .
    .
    {
        "oid": "1.3.6.1.4.1.77.1.3.7.0",
        "value": "0",
        "type": "Integer"
    },
    {
        "oid": "1.3.6.1.4.1.77.1.4.1.0",
        "value": "WORKGROUP",
        "type": "OctetString"
    }
]
```

### GetTrap
**GetTrapRequest**
Get `/gettrap`
http://163.22.32.174:4000/gettrap
#### Request
none

#### Response
##### 200(ok)

**範例**
Get `/gettrap`
```javascript=
{
    "pdu" : {
        "varbinds" : {
            "oid" : "1.3.4.1.2.3.1",
            "typename" : "OctetString",
            "value" : "snmptrap",
            "string_value" : "snmptrap"
            },   
        "op" : "Trap(4)",
        "enterprise" : "1.3.6.1.4.1.890.1.15",
        "agent_addr" : "10.32.21.206",
        "generic_trap" : 2,
        "specific_trap" : 3,
        "time_stamp" : 3003
    },
    "_id" : "5b13e4858dbff111bd8b9fe5",
    "version" : "v1(0)",
    "community" : "public",
    "time" : "2018-06-03 21:11:42",
    "__v" : 0
}
```
