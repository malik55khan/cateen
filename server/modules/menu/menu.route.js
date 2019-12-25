'use strict'

module.exports = function (app, express, passport) {
    
    var ctrl = require('./menu.controller');
    var jwToken = require('../../config/jwToken.js');
    var router = express.Router();
    router.route(`/add`).post(ctrl.add);
    router.route(`/get`).get(ctrl.get);
    router.route(`/update`).post(ctrl.update);
    router.route(`/freezeTodaysMenu`).post(ctrl.freezeTodaysMenu);
    app.use('/menu', router);
};