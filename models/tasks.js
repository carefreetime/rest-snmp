var mongoose = require('mongoose');

var TasksSchema = new mongoose.Schema({
    pdu : {
        type : String
        },
    sec : {
        type : String
    },
    n : {
        type : String
    },
    m : {
        type : String
    },
    oid : {
        type : String
    }
});

var Tasks = mongoose.model('Tasks', TasksSchema);
module.exports = Tasks;