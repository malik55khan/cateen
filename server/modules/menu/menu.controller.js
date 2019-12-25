'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var mailer = require('../../mailer/mailer');
var CommonService = require('../../services/common');
const menuService = require('./menu.service');
var responseMessage = require('./menu.message');
var loadsh = require('lodash');
var validator = require("email-validator");
var jwToken = require('../../config/jwToken.js');
var moment = require('moment-timezone');
var CONFIG = require('../../config/index');
var socketController = require('../socket/socket.controller');
var settingService = require('../setting/setting.service');
 

var add = async (req, res)=>{
    try {
        var data = req.body ? req.body : {};
        let menu = await menuService.create(data);
        await settingService.update({},{isPaymentActive : false});
        socketController.menuCreated(menu);
        return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.menu_added })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};

var getTodaysMenu = async (req, res) => {
    try {
        let date = new Date().toDateString();
        let menu = await menuService.getTodaysMenu({date : date},{});
        if(menu){
            return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.menu_fetched })
        }
        else{
            return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.menu_not_added })
        }
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}


var update = async(req, res) => {
    try {

        // if(new Date() > new Date().setHours(9)){
        //     return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.menu_freezed })
        // }
        let data = req.body ? req.body : {};
        let date = new Date().toDateString();
        let menu = await menuService.update({date : date},data);
        socketController.menuUpdated(menu);
        return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.menu_updated })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}

var freezeTodaysMenu = async (req, res) => {
        try {
            let data = { isFreezed : true };
            let date = new Date().toDateString();
            let menu = await menuService.update({date : date},data);
            socketController.menuFreezed(menu);
            return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.menu_updated })
        }catch(err){
            if (err) {
                return res.json({ status: "Failure", code: 301, msg: err.message });
            }
        }
}



exports.add = add;
exports.get = getTodaysMenu;
exports.update = update;
exports.freezeTodaysMenu = freezeTodaysMenu;

