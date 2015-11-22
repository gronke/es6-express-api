'use strict';

var path = require('path');
var express = require('express');
var app = express();

var port = process.env['PORT'] || 3000;

var Route = require('./lib/Route');
var route = new Route('/api/v1', app, {
	baseDir: path.resolve(__dirname)
});

app.listen(port);
