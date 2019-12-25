var loadsh = require('lodash');
var CryptoJS = require("crypto-js");
var ObjectId = require('mongoose').Types.ObjectId;
const CONFIG = require('../config/index');
var encrypt = (data) => new Promise(async (resolve, reject) => {
    password = CONFIG.dataEncryptionKey;
    if (!data) reject(false);
    var iv = CryptoJS.lib.WordArray.random(128 / 8);
    var salt = CryptoJS.lib.WordArray.random(128 / 8);
    var encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), password);
    var transitmessage = salt.toString() + iv.toString() + encryptedData.toString();
    return resolve(transitmessage);
});

var decrypt = async (text) => new Promise(async (resolve, reject) => {
    if (!text) return '';
    var encrypted = text.substring(64);
    var decrypted = CryptoJS.AES.decrypt(encrypted, CONFIG.dataEncryptionKey)
    decrypted = decrypted.toString(CryptoJS.enc.Utf8)
    res = JSON.parse(decrypted);
    return resolve(res);;

});
var encryptUser = async (user) => new Promise(async (resolve, reject) => {
    let personalInfo = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dob: user.dob,
        phone: user.phone,
        gender: user.gender,
        identityImage: user.identityImage ? user.identityImage : ""
    };
    user.personalInfo = await encrypt(personalInfo);
    user = deletePersonalInfo(user);
    resolve(user);
});
const deletePersonalInfo = (profile) => {
    delete profile.firstName;
    delete profile.lastName;
    delete profile.email;
    delete profile.dob;
    delete profile.phone;
    delete profile.gender;
    delete profile.identityImage;
    delete profile.cardDetails;
    delete profile.shippingAddress;
    return profile;
}
const encryptPersonalInfo = (data) => new Promise(async (resolve, reject) => {
    if (!loadsh.isEmpty(data)) {
        if (loadsh.isArray(data)) {
            await data.forEach(async (profile, i) => {
                if (profile.userType == 4) {await encryptUser(profile);}
            });
            return resolve(data);
        } else {
            if (data.userType == 4) {
                await encryptUser(data);
            }
            return resolve(data);
        }
    } else {
        resolve(data);
    }
});
exports.encryptOrder = (data) => new Promise(async (resolve, reject) => {
    if (!loadsh.isEmpty(data)) {
        if (loadsh.isArray(data)) {
            await data.forEach(async (order, i) => {
                await encryptUser(data[i].patient);
                data[i].shippingAddress = await encrypt(order.shippingAddress);
            });
            return resolve(data);
        } else {
            await encryptUser(data.patient);
            data.shippingAddress = await encrypt(data.shippingAddress);
            return resolve(data);
        }
    } else {
        resolve(data);
    }
});
exports.encryptAppointment = (data) => new Promise(async (resolve, reject) => {
    if (!loadsh.isEmpty(data)) {
        if (loadsh.isArray(data)) {
            await data.forEach(async (appointment, i) => {await encryptUser(appointment.patientId[0]);});
            return resolve(data);
        } else {
            await encryptUser(data.patientId[0]);
            return resolve(data);
        }
    } else {
        resolve(data);
    }
});
exports.bindQuery = function bindQuery(queryObject, defultSortBy = '_id') {
    let aggregateQuery = [];
    let query = queryObject.query || {};
    query["isDeleted"] = false;
    if (!loadsh.isUndefined(query._id)) {
        query._id = ObjectId(query._id);
    }
    aggregateQuery.push({ $match: query });
    if (queryObject.sortField) {
        let sortField = "$" + queryObject.sortField;
        aggregateQuery.push({ $addFields: { sortField: { $toLower: sortField } } });
        let sortOrder = queryObject.sortOrder ? Number(queryObject.sortOrder) : -1;
        aggregateQuery.push({ $sort: { sortField: sortOrder } });
    }
    else {
        let sortField = "$" + defultSortBy;
        aggregateQuery.push({ $addFields: { sortField: { $toLower: sortField } } });
        let sortOrder = 1
        aggregateQuery.push({ $sort: { sortField: sortOrder } });
        // let sort = {};
        // sort[defultSortBy] = 1;
        // aggregateQuery.push({ $sort: sort });
    }
    if (queryObject.offSet && queryObject.limit) {
        let offSet = Number(queryObject.offSet);
        let limit = Number(queryObject.limit);
        let skip = (Number(offSet) - 1) * queryObject.limit;
        aggregateQuery.push({ $skip: skip });
        aggregateQuery.push({ $limit: limit });
    }

    return aggregateQuery;
}
exports.getReferalURL = function (req) {
    if (req.headers.referer) {
        return req.headers.referer;
    } else {
        return req.protocol + '://' + req.headers.host + '/';
    }
}
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.encryptPersonalInfo = encryptPersonalInfo;
exports.encryptUser = encryptUser;