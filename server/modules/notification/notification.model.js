var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var crypto = require('crypto');
var CONFIG = require('../../config/index');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var NotificationSchema = new Schema({
    message : {type : String, default : '' },
    comment : {type : String, default : 'Please verify' },
    isDeleted: {type: Boolean,default: false},
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });



NotificationSchema.plugin(mongoosePaginate);
var notificationModal = mongoose.model('canteennotification', NotificationSchema);
module.exports = notificationModal;