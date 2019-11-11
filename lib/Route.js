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
    if (typeof(this.options.baseDir) === 'string') {
      return this.options.baseDir;
    } else {
      return path.join(defaults.baseDir, this.prefix);
    }
  }

  addParam(name, mapping) {
    if (mapping === undefined) {
      mapping = (value) => value;
    }
    this.app.param(name, (req, res, next, value) => {
      res.locals[name] = mapping(value);
      next();
    });
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

  _wrap(method, args) {
    let app
    if (args[0].startsWith('/')) {
      app = this.app
    } else {
      app = this.parent.app
      args[0] = `${this.prefix}${args[0]}`
    }
    return app[method].apply(app, args);
  }

  get() {
    return this._wrap('get', arguments);
  }

  post() {
    return this._wrap('post', arguments);
  }

  all() {
    return this._wrap('all', arguments);
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
