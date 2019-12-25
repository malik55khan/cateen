'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var mailer = require('../../mailer/mailer');
var CommonService = require('../../services/common');
const orderService = require('./order.service');
const menuService = require('../menu/menu.service');
const notificationService = require('../notification/notification.service');
var responseMessage = require('./order.message');
var loadsh = require('lodash');
var validator = require("email-validator");
var jwToken = require('../../config/jwToken.js');
var moment = require('moment-timezone');
var CONFIG = require('../../config/index');
var socketController = require('../socket/socket.controller');


var add = async (req, res)=>{
    try {
        var data = req.body ? req.body : {};
        let userId = ObjectId(data.userId);
        let date = new Date().toDateString();
        let order = await orderService.get({userId : userId, date : date});
        if(order){
            order = await orderService.update({_id : ObjectId(order._id)},data);
            if(order.isAccepted == true){
                socketController.orderConfirmed(data)
            }
            else{
                socketController.orderCancelled(data)
            }
            return res.json({data : order,  status: "Success", code: 200, msg: responseMessage.message.order_updated })
        }
        else{
            order = await orderService.create(data);
            if(order.isAccepted == true){
                socketController.orderConfirmed(data)
            }
            return res.json({data : order,  status: "Success", code: 200, msg: responseMessage.message.order_added })
        }
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};




var get = async (req, res) => {
    try {
        let userId = req.params.userId;
        let date = new Date().toDateString();
        let menu = await menuService.getTodaysMenu({date : date},{});
        if(menu){
            menu.isAccepted = await orderService.getOrderStatus({date : date, userId : userId})
            return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.menu_fetched })
        }
        else{
            return res.json({data : menu,  status: "Success", code: 400, msg: responseMessage.message.menu_not_added })
        }
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}


var update = async(req, res) => {
    try {
        let data = req.body ? req.body : {};
        let date = new Date().toDateString();
        let menu = await orderService.update({date : date, userId : data.userId},data);
        return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.order_updated })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}



var getOrdersOfThisWeek = async (req, res) => {
    try {
        let userId = req.params.userId;
        let date = new Date();
        let currentDate = new Date().getDate();
        let day = new Date().getDay();
        let lastMonday = currentDate - (5-day);
        date = new Date().setDate(lastMonday);
        let timeStamp =  {
            // $gte: _dateStart,
            $gte: date
          };
        let orders = await orderService.getAll({userId : userId, created_at : timeStamp, isAccepted : true,paymentVerified : false })
        return res.json({data : orders,  status: "Success", code: 200, msg: responseMessage.message.menu_fetched })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}

var getPreviousUnpaidOrders = async (req, res) => {
    try {
        let userId = req.params.userId;
        let date = new Date();
        let currentDate = new Date().getDate();
        let day = new Date().getDay();
        let lastMonday = currentDate - (5-day);
        date = new Date().setDate(lastMonday);
        let timeStamp =  {
            // $gte: _dateStart,
            $lt: date
          };
        let orders = await orderService.getAll({userId : userId, created_at : timeStamp, isAccepted : true, paymentVerified : false})
        return res.json({data : orders,  status: "Success", code: 200, msg: responseMessage.message.menu_fetched })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}



var doUserPayment = async (req, res) => {
    try {
        console.log("req body-------",req.body);
        var data = req.body ? req.body : {};
        let notification = await notificationService.create({message : data.message,comment:data.comment});
        let OrdersIds = []
        data.orderIds.forEach(element => {
            OrdersIds.push(ObjectId(element));
        });
        console.log("orderIds------",OrdersIds)
        let payments = await orderService.update({_id : {$in :OrdersIds }},{paymentDone:true,comment : data.comment})
        socketController.sendPaymentNotification({name :data.name});
        return res.json({ data: payments, status: "Success", code: 200, msg: responseMessage.message.notification_added })
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};













exports.add = add;
exports.get = get;
exports.update = update;
exports.getOrdersOfThisWeek = getOrdersOfThisWeek;
exports.getPreviousUnpaidOrders = getPreviousUnpaidOrders;
exports.doUserPayment = doUserPayment;

