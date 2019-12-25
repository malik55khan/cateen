var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var crypto = require('crypto');
var CONFIG = require('../../config/index');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var SettingSchema = new Schema({
    QRImage : {type : String, default : null },
    isActive: { type: Boolean, default: true },
    isDeleted: {type: Boolean,default: false},
    UPI : {type: String, default : null },   
    phone : {
        type : String ,
        default : null  
    },
    isPaymentActive: { type: Boolean,default: false}    
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });



SettingSchema.plugin(mongoosePaginate);
var settingModal = mongoose.model('canteensetting', SettingSchema);
module.exports = settingModal;