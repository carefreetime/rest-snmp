const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create trap Schema & model
const TrapSchema = new Schema({
    // version : {
    //     type : String
    // },
    // community : {
    //     type : String
    // },
    // pdu : {
    //     op : {
    //         type : String
    //     },
    //     enterprise : {
    //         type : String
    //     },
    //     agent_addr : {
    //         type : String
    //     },
    //     generic_trap : {
    //         type : Number
    //     },
    //     specific_trap : {
    //         type : Number
    //     },
    //     time_stamp : {
    //         type : Number
    //     },
    //     varbinds : [
    //         {
    //             oid : {
    //                 type : String
    //             },
    //             typename : {
    //                 type : String
    //             },
    //             value : {
    //                 type : Number
    //             },
    //             string_value : {
    //                 type : String
    //             }
    //         }
    //     ]
    // }
    //add in geo location
    name : {
        String
    }
});

const Trap = mongoose.model('trap', TrapSchema);

module.exports = Trap;
