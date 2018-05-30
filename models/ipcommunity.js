var mongoose = require('mongoose');

var IpcommunitySchema = new mongoose.Schema({
  ip: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  community: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
});

//authenticate input against database
IpcommunitySchema.statics.authenticate = function (ip, community, callback) {
  Ipcommunity.findOne({ ip: ip })
    .exec(function (err, ipcommunity) {
      if (err) {
        return callback(err)
      } else if (!user) {
        var err = new Error('Ip not found.');
        err.status = 401;
        return callback(err);
      }
    });
}

var Ipcommunity = mongoose.model('Ipcommunity', IpcommunitySchema);
module.exports = Ipcommunity;