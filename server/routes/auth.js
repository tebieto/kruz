var express = require('express');
var authRouter = express.Router();
var passport = require('passport');
const token = require('./token');

//Model for the user schema
var users = require('../controllers/auth');

//Authenticate user login request
authRouter.post('/authenticate', users.authUser);

//Register user
authRouter.post('/user', users.userCreate);

//Verify SMS code
authRouter.post('/user/:id/verify', users.verify);

//Get user account details (secured)
authRouter.get('/users', token.required, users.getUser);


//We export the router and make it usable by the front-end app.
module.exports = authRouter;