'use strict'

module.exports = function (app, express, passport) {
    
    var userCtrl = require('./user.controller');
    var jwToken = require('../../config/jwToken.js');
    var router = express.Router();
    // User Routes
   

    router.route(`/register`).post(userCtrl.signUp);
    router.route(`/login`).post(userCtrl.login);
    router.route(`/getAllUsers`).get(userCtrl.getAllUsers);
    // router.route(`/forgot-password`).post(userCtrl.forgotPassword);
    // router.route(`/check-token`).post(userCtrl.checkToken);
    // router.route(`/reset-password`).post(userCtrl.resetPassword);
    // router.route('/activate-account').post(userCtrl.activateAccount);
    // router.route(`/`).get(jwToken.isAuthorizedToken,userCtrl.getAll);
    // router.route(`/me/update-password`).post(jwToken.isAuthorizedToken,userCtrl.changePassword);
    // // Admin Routes
    // router.route(`/:id`)
    //     .get(jwToken.isAuthorizedToken,userCtrl.getUser)
    //     .put(jwToken.isAuthorizedToken,userCtrl.editUser)
    //     .delete(jwToken.isAuthorizedToken,userCtrl.deleteUser); 

    app.use('/users', router);
};