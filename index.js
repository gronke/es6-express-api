'use strict';

var express = require('express');
var app = express();

var Route = require('./lib/Route');
var route = new Route('/api/v1', app);

app.listen(3000);