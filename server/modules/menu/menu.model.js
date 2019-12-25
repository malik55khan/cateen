var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var crypto = require('crypto');
var CONFIG = require('../../config/index');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var MenuSchema = new Schema({
    items : {
        type: String, 
    },
    todaysSpecial : {
        type: String, 
        default : 'None' 
    },
    isFreezed : { type: Boolean, default: false },
    date : {type : String, default : new Date().toDateString() },
    isActive: { type: Boolean, default: true },
    isDeleted: {type: Boolean,default: false},
    price : {
        type : Number,
        required : true
    }
    
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });



MenuSchema.plugin(mongoosePaginate);
var menuModal = mongoose.model('canteenmenu', MenuSchema);
module.exports = menuModal;