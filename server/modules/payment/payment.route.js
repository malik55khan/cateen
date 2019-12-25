'use strict'

module.exports = function (app, express, passport) {
    
    var ctrl = require('./payment.controller');
    var jwToken = require('../../config/jwToken.js');
    var router = express.Router();
    router.route(`/requestPayment`).get(ctrl.requestPayment);
    router.route(`/getAllPendingPayments`).get(ctrl.getAllPendingPayments);
    router.route(`/verifyPayments`).post(ctrl.verifyPayments);

    app.use('/payment', router);
};