'use strict';

var express = require('express');
var app = express();

var port = process.env['PORT'] || 3000;

var Route = require('./lib/Route');
var route = new Route('/api/v1', app);

app.listen(port);
