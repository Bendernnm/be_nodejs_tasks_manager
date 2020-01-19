const routesWrapper = require('../../helpers/routes-wrapper');

const get = require('./get');
const create = require('./create');
const edit = require('./edit');
const remove = require('./delete');

const endpoints = { get, create, edit, remove };

module.exports = { endpoints, routes: routesWrapper(endpoints) };
