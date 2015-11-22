'use strict';

var path = require('path');
var express = require('express');
var app = express();

var host = "0.0.0.0";
var port = process.env['PORT'] || 3000;

var Route = require('./lib/Route');
var route = new Route('/api/v1', app, {
	baseDir: path.resolve(__dirname, '/api/v1')
});

var server = app.listen(port, host, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});
