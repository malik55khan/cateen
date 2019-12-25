'use strict'

module.exports = function (app, express, passport) {
    
    var ctrl = require('./setting.controller');
    var router = express.Router();
    // User Routes
    router.route(`/add`).post(ctrl.add);
    router.route(`/get`).get(ctrl.get);
    router.route(`/uploadQRCode`).post(ctrl.uploadQRCode);
    router.route(`/update`).post(ctrl.update);
    app.use('/setting', router);
};