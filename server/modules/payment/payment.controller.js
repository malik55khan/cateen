'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
const orderService = require('../order/order.service');
var responseMessage = require('./payment.message');
var CONFIG = require('../../config/index');
var socketController = require('../socket/socket.controller');
var settingService = require('../setting/setting.service');


var requestPayment = async (req, res) => {
    try {
        socketController.requestPayment();
        await settingService.update({},{isPaymentActive : true});
        return res.json({ status: "200", code: 301, msg: '' });
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}


var getAllPendingPayments = async (req, res) => {
    try {
        let pendingPayments = await orderService.getAll({  paymentVerified: false }, {});
        return res.json({ data: pendingPayments, status: "Success", code: 200, msg: '' })
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
}

var verifyPayments = async (req, res) => {
    try {
        var data = req.body ? req.body : {};
        let orderId = ObjectId(data.orderId);
        console.log("orderId",orderId)
        let payments = await orderService.update({_id : orderId},{paymentDone:true,paymentVerified : true})
        return res.json({ data: payments, status: "Success", code: 200, msg: responseMessage.message.paymentVerified })
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};



exports.requestPayment = requestPayment;
exports.getAllPendingPayments = getAllPendingPayments;
exports.verifyPayments = verifyPayments;
