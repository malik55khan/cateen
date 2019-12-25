'use strict'

module.exports = function (app, express, passport) {

    var sharedCtrl = require('./shared.controller');

    var jwToken = require('../../config/jwToken.js');
    var router = express.Router();
    router.route(`/generate-meeting-link`)
        .get(sharedCtrl.generateMeetingLink);
    router.route(`/get-specialist-stats`)
        .get(jwToken.isAuthorizedToken, sharedCtrl.getSpecialistStats);
    app.use('/shared', router);
};