'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var CommonService = require('../../services/common');
const userService = require('./../user/users.service');
var responseMessage = require('./../user/user.message');
var _ = require('lodash');
var moment = require('moment-timezone');
var request = require("request");
const orderService = require('../order/order.service');
const appointmentService = require('../appointment/appointment.service');
const CONFIG = require('../../config/index');
var jwt = require('jsonwebtoken');
var getStats = async (req, res) => {
    try {
        let specialists = await userService.countUser({ isDeleted: false, userType: 3 });
        let patients = await userService.countUser({ isDeleted: false, userType: 4 });
        let newOrders = await orderService.countOrder({ orderStatus: "Pending" });
        let Orders = await orderService.countOrder();
        let data = {
            totalPatients: patients,
            totalSpecialists: specialists,
            totalNewOrders: newOrders,
            totalOrders: Orders
        };
        return res.json({ status: "Success", code: 200, msg: responseMessage.message.found_success, data: data });
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message, err: err });
        }
    }
};
const getSpecialistStats = async (req, res) => {
    try {
        let specialistId = ObjectId(req.access_token.profileId);
         let conditions = {
             query:{
                 specialistId:specialistId
             }
         };
        var aggregate =  CommonService.bindQuery(conditions);
        aggregate.push({$group:{"_id":"$patientId"}});
        let patient = await appointmentService.getAll(aggregate);
        conditions = {
            query:{
                specialistId:specialistId,
                status:"pending"
            }
        }
        aggregate =  CommonService.bindQuery(conditions);
        let pending = await appointmentService.getAll(aggregate);
        conditions = {
            query:{
                specialistId:specialistId,
                orderId:{$exists:true}
            }
        }
        aggregate =  CommonService.bindQuery(conditions);
        aggregate.push({ $lookup: { "from": "orders", "localField": "orderId", "foreignField": "_id", "as": "orderId" } });
        let txn = await appointmentService.getAll(aggregate);
        let amount = 0;
        let totalAmount = _.filter(txn,(elem)=>{
            amount += elem.orderId[0].totalAmount;
        })
        
        let data = {
            totalPatients: patient.length,
            totalPendingAppointments: pending.length,
            totalRevenue: amount,
           // totalOrders: Orders
        };
        return res.json({ status: "Success", code: 200, msg: responseMessage.message.found_success, data: data });
    } catch (err) {
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message, err: err });
        }
    }
};
const getMeetingLink = (body) => new Promise((resolve, reject) => {
    let token = generateJWT(); 
    var options = {
        method: 'POST',
        url: 'https://api.zoom.us/v2/users/me/meetings',
        headers: {
            'content-type': 'application/json',
            authorization: 'Bearer ' + token
        },
        body: body,
        json: true
    };
    //options.body = _.extend({}, options.body, body);
    // options.body.settings = {
    //     audio:"both",host_video:true,auto_recording:"local",contact_email:email
    // };
    request(options, function (error, response, body) {
        if (error) {
            return reject(error);
        }
        resolve(body);

    });
});
const generateMeetingLink = async (req,res)=>{
    try{
        
        let body = await getMeetingLink();
        return res.json({ status: "Success", code: 200, msg: responseMessage.message.found_success, data: body });
      }catch(err){
        return res.json({ status: "Failure", code: 301, msg: err.message, err: err });
      }
}
const generateJWT = () =>{
    const payload = {
        iss: CONFIG.ZOOM.appKey,
        exp: ((new Date()).getTime() + 864000)
      };
      return jwt.sign(payload, CONFIG.ZOOM.appSecret);
};
const getMeeting = (meetingId) => new Promise((resolve, reject) => {
    let token = generateJWT(); 
    var options = {
        method: 'GET',
        url: 'https://api.zoom.us/v2/meetings/'+meetingId,
        headers: {
            'content-type': 'application/json',
            authorization: 'Bearer ' + token
        },
        body: {},
        json: true
    };
    request(options, function (error, response, body) {
        if (error) {
            return reject(error);
        }
        resolve(body);
    });
});
exports.getStats = getStats;
exports.generateMeetingLink = generateMeetingLink; 
exports.getMeetingLink = getMeetingLink;
exports.getMeeting = getMeeting;
exports.getSpecialistStats = getSpecialistStats;