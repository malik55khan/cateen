'use strict'
var ObjectId = require('mongoose').Types.ObjectId;
var crypto = require('crypto');
var mailer = require('../../mailer/mailer');
var CommonService = require('../../services/common');
const settingService = require('./setting.service');
var responseMessage =  require('./setting.message');
var loadsh = require('lodash');
var validator = require("email-validator");
var jwToken = require('../../config/jwToken.js');
var moment = require('moment-timezone');
var CONFIG = require('../../config/index');
var socketController = require('../socket/socket.controller');
var formidable = require('formidable');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');


var add = async (req, res)=>{
    try {
        return;
        var data = req.body ? req.body : {};
        let menu = await settingService.create(data);
        return res.json({data : menu,  status: "Success", code: 200, msg: responseMessage.message.setting_added })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};

var get = async (req, res)=>{
    try {
        let setting = await settingService.get({});
        return res.json({data : setting,  status: "Success", code: 200, msg: responseMessage.message.settings_fetched })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};


var update = async (req, res)=>{
    try {
        let body = req.body ? req.body : {}; 
        let setting = await settingService.update({},body);
        return res.json({data : setting,  status: "Success", code: 200, msg: responseMessage.message.settings_fetched })
    }catch(err){
        if (err) {
            return res.json({ status: "Failure", code: 301, msg: err.message });
        }
    }
};

var uploadQRCode = (req, res) => {
    try {
        // console.log("req-------",req)
        const form = new formidable.IncomingForm();
        console.log("form----------",form)
        form.keepExtensions = true; 
        const pathSeparator = path.sep;
        let validImage;
        form.onPart = function (part) {
            if (!part.filename || part.filename.match(/\.(jpg|jpeg|png|pdf|doc|docx|csv)$/i)) {
                validImage = true;
                this.handlePart(part);
            }
            else {
                validImage = false;
            }
        }
        form.parse(req, async function (err, fields, files) {
            if (validImage == true) {
                if (!files.file) {
                    return res.json({ success: false, code: 400, msg: 'File not found' });
                }

                let mediaDir = 'QRCode';
                const fileName = files.file.name;
                mkdirp(`${CONFIG.DocumentUrl.BaseDirecory}` + mediaDir, function (err) {
                    if (err) {
                        console.error(err)
                    }
                    else {
                        let imagepath = `${mediaDir}/${fileName}`;
                        let obj = {
                            fileName: fileName,
                            imagePath: imagepath
                        };
                        var oldpath = files.file.path;
                        var newPath = `${CONFIG.DocumentUrl.BaseDirecory}` + `${imagepath}`;
                        fs.rename(oldpath, newPath, async function (err) {
                            if (err) {
                                res.send('Error Uploading Data: ' + JSON.stringify(err) + '\n' + JSON.stringify(err.stack));
                            }
                            else {
                                let setting = await settingService.update({},{QRImage : '/'+imagepath})
                                res.json({ success: true, code: 200, msg: 'QR Code Uploaded', setting : setting });
                            }
                        });
                    }
                });

            } else {
                console.log("invalid file----")
                res.json({ success: false, code: 400, msg: 'Invalid file' });
            }
        });
    } catch (err) {
        console.log(err);
    }
}

exports.add = add;
exports.get = get;
exports.uploadQRCode = uploadQRCode;
exports.update = update;