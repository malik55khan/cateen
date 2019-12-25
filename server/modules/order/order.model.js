var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var crypto = require('crypto');
var CONFIG = require('../../config/index');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var OrderSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'canteenusers'},
    menuId: {type: mongoose.Schema.Types.ObjectId, ref: 'canteenmenu'},
    date : {type : String, default : new Date().toDateString() },
    isActive: { type: Boolean, default: true },
    isDeleted: {type: Boolean,default: false},
    isLiable: {type: Boolean,default: true},
    paymentDone : {type: Boolean,default: false},   
    paymentVerified : {type: Boolean,default: false},
    price : {
        type : Number,
        required : true
    },
    feedbacks: { type: String,default: ''},    
    comment: { type: String,default: ''},       
    isAccepted: { type: Boolean,default: false },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });



OrderSchema.plugin(mongoosePaginate);
var orderModal = mongoose.model('canteenorder', OrderSchema);
module.exports = orderModal;