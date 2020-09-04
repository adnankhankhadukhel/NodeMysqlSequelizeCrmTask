/**
 * @section: Require File injection to the program here...
 * @Method: N/A
 * @purpose: Required librabries induction along with require program controllers
 * @parameters: N/A
 **/

// librabries section
var express = require('express');
const middleware = require("./middleware/verification");

// controllers section
var UsersCtrl = require('./controllers/users');
var InfoCtrl = require('./controllers/info');

// librabryInitialization
const router = express.Router();

/**
 * @section: Route Creation for REST API's
 * @purpose: To understand business logic of respective API's via respective controllers methods
 **/

//Basic CRUD operations for users
router.route('/signUp').post(UsersCtrl.registerUser);
router.route('/login').post(UsersCtrl.login);
router.route('/deleteUser').delete(middleware.verifyToken, UsersCtrl.deleteUser);
router.route('/listCustomers').get(middleware.verifyToken, UsersCtrl.listCustomers);
router.route('/updateStatus').put(middleware.verifyToken, UsersCtrl.updateStatus);
router.route('/addCustInfo').post(middleware.verifyToken, InfoCtrl.addCustInfo);

// //testing api
router.route('/health-check').get(UsersCtrl.healthcheck);

module.exports = router;