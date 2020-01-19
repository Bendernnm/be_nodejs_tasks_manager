const routesWrapper = require('../../helpers/routes-wrapper');

const signIn = require('./sign-in');
const signUp = require('./sign-up');

const endpoints = { signIn, signUp };

module.exports = { endpoints, routes: routesWrapper(endpoints) };
