'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var mailer = require('../../mailer/mailer');
var CommonService = require('../../services/common');
const notificationService = require('./notification.service');
var responseMessage = require('./notification.message');
var loadsh = require('lodash');
var validator = require("email-validator");
var jwToken = require('../../config/jwToken.js');
var moment = require('moment-timezone');
var CONFIG = require('../../config/index');
var socketController = require('../socket/socket.controller');



var getAll = async (req, res) => {
    try {
        let notification = await notificationService.getAll({ isDeleted : false, created_at : -1});
        return res.json({ data: notification, status: "Success", code: 200, msg: 'Success' })
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}


var update = async (req, res) => {
    try {
        console.log("req.body",req.body);
        console.log("req.params",req.params);

        let _id = ObjectId(req.params.id);
        let data = req.body ? req.body : {};
        let notification = await notificationService.update({ _id: _id }, data);
        return res.json({ data: notification, status: "Success", code: 200, msg: responseMessage.message.notification_updated })
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}










exports.getAll = getAll;
exports.update = update;
