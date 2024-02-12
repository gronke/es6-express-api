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

    this.options = options;
    this.parent = parent;
    this.app = express.Router();
    this.prefix = (typeof(prefix) === 'string') ? prefix : defaults.prefix;

    const _app = (parent instanceof Route) ? parent.app : parent;
    _app.use(this.prefix, this.app);

    debug.log('Initializing new Route', this.fullPath);

    this._loadRoute();

  }

  get fullPath() {
    if (this.parent) {
      const parentPath = this.parent.fullPath;
      if (parentPath && parentPath.length) {
        return `${parentPath}${this.prefix}`;
      }
    }
    return this.prefix;
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
      try {
        res.locals[name] = mapping(value);
        next();
      } catch(e) {
        next(e);
      }
    });
  }

  follow(suffix, filepath) {
    var options = {};
    Object.keys(this.options).forEach((key) => {
      options[key] = this.options[key];
    });
    filepath = filepath !== undefined ? filepath : suffix;
    options.baseDir = path.join(this.path, filepath);
    const _suffix = (suffix.startsWith('/') ? '' : '/') + suffix;
    return new Route(_suffix, this, options);
  }

  _wrap(method, args) {
    let app;
    const decodedUrl = decodeURIComponent(args[0]);
    if (decodedUrl.startsWith('/')) {
      app = this.app;
    } else {
      app = this.parent.app;
      decodedUrl = `${this.prefix}${decodedUrl}`;
    }
    return app[method].apply(app, args);
  }

  get() {
    return this._wrap('get', arguments);
  }

  post() {
    return this._wrap('post', arguments);
  }

  put() {
    return this._wrap('put', arguments);
  }

  patch() {
    return this._wrap('patch', arguments);
  }

  delete() {
    return this._wrap('delete', arguments);
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
