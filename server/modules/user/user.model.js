var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var crypto = require('crypto');
var CONFIG = require('../../config/index');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String, unique: true, required: 'Please enter the email', 
        //uniqueCaseInsensitive: true, lowercase: true
    },
    password: {type: String, select: false},
    userType: {  //1-Admin 3-Specialist 4-Patient 2-Providers
        type:Number,enum: [1,2],default: 2    
    },
    salt: {type: String},
    token: {
        type: String,
        default: null
    },
    phone: {
        type: String,
        default: null
    },
    name : {
        type: String,
        required : true
    },
    resetPassword:{
        token:{type: String,default:""},
        expiry:{type: Date},
        otp:{type: Number},
        isExpired: { type: Boolean,default:false }
    },
    isActive: { type: Boolean, default: true },
    isDeleted: {type: Boolean,default: false},
    lastLogin: {type: Date, default: Date.now},
    lastSeen: {type: Date, default: Date.now},
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

UserSchema.pre('save', function (next) {
    var user = this;
    // generate a random salt for every user for security
    user.salt = crypto.randomBytes(16).toString('hex');
    //user.emailVerificationToken = crypto.randomBytes(16).toString('hex');
    user.password = crypto.pbkdf2Sync(user.password, this.salt, 1000, 64, 'sha512').toString('hex');
    next();
});
UserSchema.methods.generateJwt = function (next) {
    var expiry = new Date();
    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
    }, CONFIG.JWTSecret,{expiresIn: '24h'}); // DO NOT KEEP YOUR SECRET IN THE CODE!

};

UserSchema.methods.verifyToken = function (token, cb) {
    jwt.verify(token, CONFIG.JWTSecret, function (err, dcode) {
        if (err) {
            cb(false);
        }
        else {
            cb(dcode);
        }
    })

};

UserSchema.index({ email: 1, userType: 1 }, { unique: true });
UserSchema.plugin(mongoosePaginate);
var userModel = mongoose.model('canteenusers', UserSchema);
module.exports = userModel;