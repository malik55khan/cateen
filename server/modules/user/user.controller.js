'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var mailer = require('../../mailer/mailer');
var CommonService = require('../../services/common');
const userService = require('./users.service');
var responseMessage = require('./user.message');
var loadsh = require('lodash');
var validator = require("email-validator");
var jwToken = require('../../config/jwToken.js');
var moment = require('moment-timezone');
var CONFIG = require('../../config/index');


var signUp = async (req, res)=>{
    try {
        var data = req.body ? req.body : {};
        
        if(data.userType == 4){
            //data.personalInfo = await CommonService.decrypt(data.personalInfo);
        }
        data.email = (data.email).toLowerCase();
        let userProfileData = data;
        if (!validator.validate(data.email)) {
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.valid_email });
        }
        if (loadsh.isEmpty(data.email) || loadsh.isEmpty(data.password)) { // for not empty object
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.param_missing });
        }
        let isUserAlreadyExists = await userService.getLogin({email:data.email,role:data.role});
        if(isUserAlreadyExists){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.email_exist });
        }
        var token = crypto.randomBytes(25).toString('hex');
        
        data.token = token;
        crypto.randomBytes(20, async function (err, buf) {
            var token = buf.toString('hex');
            data.resetPassword = {
                "token": token,
                "isExpired":false,
                "expiry": Date.now() + 3600000
            }
            let isDataSaved = await userService.createLogin(data);
            if(!isDataSaved){
                return res.json({ status: "Failure", code: 301, msg: responseMessage.message.default_error });
            }else {
                userProfileData.loginId = isDataSaved._id;
                // let emailData = await EmailServices.getEmailTemplate('verify-account');
                var refUrl = CONFIG.WebEndPoint;
                refUrl = refUrl+"/verify-account/"+token;
                return res.json({ status: "Success", code: 200, msg: responseMessage.message.success_register })
                }
        });
        
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};



var login = async (req, res) => {
    try{
        var data = req.body ? req.body : {};
        data.email = (data.email).toLowerCase();
        if (!validator.validate(data.email)) {
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.valid_email });
        }
        if (loadsh.isEmpty(data.email) || loadsh.isEmpty(data.password)) { // for not empty object
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.param_missing });
        }
        let user = await userService.getLogin({email:data.email,'isDeleted': false},{ userType: 1,salt: 1});
        if(user==null){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.invalid_email });
        }
        var password = crypto.pbkdf2Sync(data.password, user.salt, 1000, 64, 'sha512').toString('hex');
        
        let userlogin = await userService.getLogin({email:data.email,'password': password});
        if (!userlogin || userlogin == null) {
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.wrong_password });
        }
        if (!userlogin.isActive) {
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.not_active });
        }
        
        let conditions = {
            query:{loginId:userlogin._id}
        }
        
        let aggregateQuery  = CommonService.bindQuery( conditions,'_id');
        userlogin.token = jwToken.issueToken({id: userlogin._id,userType:userlogin.userType});
        
        return res.json({ status: "Success", code: 200, msg: responseMessage.message.login_success, data: userlogin });

    }catch(err){
        if (err) {
            console.log(err);
            return res.json({ status: "Failure", code: 301, msg: err.message, err:err });
        }
    }
    
}


var getAllUsers = async (req, res)=>{
    let condition = {
        query:{userType : 2,isDeleted : false}
    }
    let aggregate = CommonService.bindQuery(condition, 'name');
    aggregate.push({ $lookup: { "from": "canteenorders", "localField": "_id", "foreignField": "userId", "as": "userOrder" } });
    // aggregate.push({ $match: { "userOrder.paymentVerified": false } });
    let users = await userService.getUser(aggregate);
    
    return res.json({ status: "Success", code: 200, msg: responseMessage.message.found_success, data: users });
};






var activateAccount = async (req, res) =>{
    var data = req.body ? req.body : {};
    try{
        if(loadsh.isUndefined(data.resetToken) || loadsh.isUndefined(data.resetToken)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.reset_token_missing }); 
        }
        let conditions = {
            query:{'resetPassword.token':data.resetToken}
        }
        let aggregateQuery  = CommonService.bindQuery( conditions,'_id');
        let user = await userService.getUser(aggregateQuery);
        if(user.length){
            user = user[0];
            let updatedUser = await userService.editUser({_id: user._id}, {$set: {
                "resetPassword.isExpired":true,
                "resetPassword.expiry": Date.now(),
                "isActive":true,
                "resetPassword.token":""
                }
            });
            console.log(updatedUser.resetPassword)
            let uProfile = await userService.editProfile({loginId: user._id}, {$set: {"isActive":true}});
            user = await CommonService.encryptPersonalInfo(user);
            return res.json({data:{isActive:true}, status: "Success", code: 200, msg: responseMessage.message.account_activated })
        }else{
            return res.json({status: "Failure", code: 201, msg: responseMessage.message.reset_link_expired })
        }
    }catch(err){
        if (err) {
            console.log(err);
            return res.json({ status: "Failure", code: 301, msg: err.message, err:err });
        }
    }
};
var resetPassword = async (req, res) =>{
    var data = req.body ? req.body : {};
    try{
        if(loadsh.isUndefined(data.resetToken) || loadsh.isUndefined(data.resetToken)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.reset_token_missing }); 
        }
        if(loadsh.isUndefined(data.password) || loadsh.isUndefined(data.cpassword)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.password_missing }); 
        }
        if(loadsh.isEmpty(data.password) || loadsh.isEmpty(data.cpassword)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.password_empty }); 
        }
        if(data.password != data.cpassword){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.password_not_matched }); 
        }
        let conditions = {
            query:{'resetPassword.token':data.resetToken}
        }
        let aggregateQuery  = CommonService.bindQuery( conditions,'_id');
        let user = await userService.getUser(aggregateQuery);
        if(user){
            user = user[0];
            data.password = crypto.pbkdf2Sync(data.password, user.salt, 1000, 64, 'sha512').toString('hex');
            let updatedUser = await userService.editUser({_id: user._id}, {$set: {
                "password":data.password ,
                "resetPassword.isExpired":true,
                "resetPassword.expiry": Date.now()
            }
            });
            user = await CommonService.encryptPersonalInfo(user);
            return res.json({data:user, status: "Success", code: 200, msg: responseMessage.message.reset_password_success })
        }
    }catch(err){
        if (err) {
            console.log(err);
            return res.json({ status: "Failure", code: 301, msg: err.message, err:err });
        }
    }
};
var forgotPassword = async (req, res) =>{
    var data = req.body ? req.body : {};
    data.email = (data.email).toLowerCase();
    if (!validator.validate(data.email)) {
        return res.json({ status: "Failure", code: 301, msg: responseMessage.message.valid_email });
    }
    if (loadsh.isEmpty(data.email)) { // for not empty object
        return res.json({ status: "Failure", code: 301, msg: responseMessage.message.param_missing });
    }
    var user = await userService.getUser([
        {$match:{email:data.email}}
    ]);
    if(!loadsh.isEmpty(user)){
        user = user[0];
        crypto.randomBytes(20, async function (err, buf) {
            var token = buf.toString('hex');
            var otp = Math.floor(100000 + Math.random() * 900000);
            let updatedUser = await userService.editUser({_id: user._id}, {$set: {
                "resetPassword.token": token,
                "resetPassword.otp": otp,
                "resetPassword.isExpired":false,
                "resetPassword.expiry": Date.now() + 3600000
            }
            });
    
            return res.json({data:user, status: "Success", code: 200, msg: responseMessage.message.reset_link_sent })
        });
        
    }else{
        return res.json({ status: "Failure", code: 301, msg: responseMessage.message.invalid_email});
    }
}
var changePassword = async (req, res) =>{
    var data = req.body ? req.body : {};
    try{
        if(loadsh.isUndefined(data.password) || loadsh.isUndefined(data.current_password) || loadsh.isUndefined(data.confirm_password)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.update_password_missing }); 
        }
        if(loadsh.isEmpty(data.password) || loadsh.isEmpty(data.current_password) || loadsh.isEmpty(data.confirm_password)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.update_password_missing }); 
        }
        if(data.password != data.confirm_password){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.password_not_matched }); 
        }
        let conditions = {
            query:{'_id':ObjectId(req.access_token.id)}
        }
        let aggregateQuery  = CommonService.bindQuery( conditions,'_id');
        var userDetails = await userService.getUser(aggregateQuery);
        if(!loadsh.isEmpty(userDetails)){
            var user = userDetails[0];
            var password = crypto.pbkdf2Sync(data.current_password, user.salt, 1000, 64, 'sha512').toString('hex');
            user = await userService.getLogin({_id:ObjectId(req.access_token.id),'password': password},{isActive:1, userType: 1,salt:1, timezone: 1,timeOffset: 1});
            if(!loadsh.isEmpty(user)){
                password = crypto.pbkdf2Sync(data.password, user.salt, 1000, 64, 'sha512').toString('hex');
                let updatedUser = await userService.editUser({_id: user._id}, {$set: {
                    "password":password
                    }
                });
                return res.json({data:user, status: "Success", code: 200, msg: responseMessage.message.update_password_success })
            }else{
                return res.json({ status: "Failure", code: 301, msg: responseMessage.message.invalid_password });     
            }
        }else{
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.invalid_password }); 
        }
    }catch(err){
        if (err) {
            console.log(err);
            return res.json({ status: "Failure", code: 301, msg: err.message, err:err });
        }
    }
};

var checkToken = async (req,res) => {
    try{
        console.log('req.resetToken',req.body.resetToken)
        if(loadsh.isUndefined(req.body.resetToken) || loadsh.isEmpty(req.body.resetToken)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.reset_token_missing }); 
        }
        let conditions = {
            query:{'resetPassword.token':req.body.resetToken}
        }
        let aggregateQuery  = CommonService.bindQuery( conditions,'_id');
        let User = await userService.getUser(aggregateQuery);
    if(!loadsh.isEmpty(User)){
        console.log(User);
        User = User[0];
        if(User.resetPassword.isExpired){
            return res.json({ status: "Success", code: 200, msg: responseMessage.message.reset_link_expired, data: {isExpired:true} });
        }else{
            return res.json({ status: "Success", code: 200, msg: responseMessage.message.reset_link_valid, data: {isExpired:false} });
        }
    }else{
        return res.json({ status: "Failure", code: 301, msg: responseMessage.message.reset_link_invalid });
    }
}catch(err){
    if (err) {
        console.log(err);
        return res.json({ status: "Failure", code: 301, msg: err.message, err:err });
    }
}
};
var getUser = async (req, res)=>{
    let userId = req.access_token.profileId;
    let aggregateQuery = [{
        $match:{_id:ObjectId(userId),isDeleted:false}
    }];
    let login_details = await userService.getProfile(aggregateQuery);
    if(!loadsh.isEmpty(login_details)){
        login_details = login_details[0];
    }
    login_details = await CommonService.encryptPersonalInfo(login_details);
    return res.json({ status: "Success", code: 200, msg: responseMessage.message.found_success, data: login_details });
};
var getAll = async (req, res)=>{
    let login_details = await userService.getAll();
    return res.json({ status: "Success", code: 200, msg: responseMessage.message.found_success, data: login_details });
};
var editUser = async (req, res)=>{
    let _id = req.access_token.profileId;
    updateProfile(_id,req,res);
};
var updateProfile = async (id,req,res) => {

    try{
        if(loadsh.isEmpty(id)){
            return res.json({ status: "Failure", code: 301, msg: responseMessage.message.param_missing });
        }
        if(req.access_token.userType==4 && !loadsh.isUndefined(req.body.personalInfo)){
            let decryptData = await CommonService.decrypt(req.body.personalInfo);
            //req.body.personalInfo = decryptData.personalInfo;
            req.body = loadsh.extend({},req.body,decryptData.personalInfo)
        }
        var data = await userService.editProfile({_id:id},req.body);
        if(!loadsh.isUndefined(req.body.isActive)){
            await userService.editUser({_id:data.loginId},{isActive:req.body.isActive});
        }
        if(!loadsh.isUndefined(req.body.isDeleted)){
            await userService.editUser({_id:data.loginId},{isDeleted:req.body.isDeleted});
        }
        if(req.access_token.userType==4)
        data = await CommonService.encryptPersonalInfo(data);
        return res.json({ status: "Success", code: 200, msg: responseMessage.message.updated_success, data: data });
    }catch(err){
        if (err) {
            console.log(err);
            return res.json({ status: "Failure", code: 301, msg: err.message, err:err });
        }
    }
};

//Admin Route
// User Routes;
exports.signUp = signUp;
exports.login = login;
exports.getAllUsers = getAllUsers;
