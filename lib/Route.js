'use strict';

var express = require('express');

var path = require('path'),
    debug = require('../lib/functions/debug');

let symbols = {
  prefix: Symbol('route'),
  options: Symbol('options')
}

let defaults = {
  prefix: '/',
  baseDir: path.join(__dirname, '..')
}

module.exports = class Route {

  constructor(prefix, parent, options) {

    debug.log('Initializing new Route', prefix);

    this.options = options;
    this.parent = parent;
    this.app = express.Router();
    this.prefix = (typeof(prefix) === 'string') ? prefix : defaults.prefix;

    const _app = (parent instanceof Route) ? parent.app : parent;
    _app.use(this.prefix, this.app);

    this._loadRoute();

  }

  get baseDir() {
    return (typeof(this.options.baseDir) === 'string') ? this.options.baseDir : path.join(defaults.baseDir, this.prefix);
  }

  follow(suffix) {
    var options = {};
    Object.keys(this.options).forEach((key) => {
      options[key] = this.options[key];
    });
    options.baseDir = path.join(this.path, suffix);
    const _suffix = (suffix.startsWith('/') ? '' : '/') + suffix;
    return new Route(_suffix, this, options);
  }

  get() {
    return this.app.get.apply(this.app, arguments);
  }

  post() {
    return this.app.post.apply(this.app, arguments);
  }

  all() {
    return this.app.all.apply(this.app, arguments);
  }

  _loadRoute() {
    debug.info('Load Route from', this.path);
    require(this.path).apply(this);
  }

  set prefix(value) {
    this[symbols.prefix] = value;
  }

  get prefix() {
    return this[symbols.prefix];
  }

  set options(value) {
    this[symbols.options] = value || {};
  }

  get options() {
    return this[symbols.options] || {};
  }

  get path() {
    return this.baseDir;
  }

};