var mongoose = require('mongoose');

var TrapsSchema = new mongoose.Schema({
    version : {
        type : String
        },
    community : {
        type : String
    },
    time : {

    },
    pdu : {
        op : {
            type: String
        },
        enterprise : {
            type: String
        },
        agent_addr : {
            type: String
        } ,
        generic_trap : {
            type: Number
        },
        specific_trap : {
            type: Number
        },
        time_stamp : {
            type: Number
        },
        varbinds : {
            oid : {
                type: String
            },
            typename : {
                type : String
            },
            value : {
                type : String
            },
            string_value : {
                type : String
            }
        }
    }
});

var Traps = mongoose.model('Traps', TrapsSchema);
module.exports = Traps;