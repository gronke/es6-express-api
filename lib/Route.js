'use strict';

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

  constructor(prefix, app, options) {

    debug.log('Initializing new Route', prefix);

    this.options = options;
    this.app = app;
    
    this.prefix = (typeof(prefix) === 'string') ? prefix : defaults.prefix;
    this.baseDir = (typeof(this.options.baseDir) === 'string') ? this.options.baseDir : path.join(defaults.baseDir, this.prefix);

    this._loadRoute();

  }

  follow(suffix) {
    var options = {};
    Object.keys(this.options).forEach((key) => {
      options[key] = this.options[key];
    });
    options.baseDir = path.join(this.path, suffix);
    return new Route(this._prefix(suffix), this.app, options);
  }

  get() {
    arguments[0] = this.prefix + arguments[0];
    return this.app.get.apply(this.app, arguments);
  }

  post() {
    arguments[0] = this.prefix + arguments[0];
    return this.app.post.apply(this.app, arguments);
  }

  all() {
    arguments[0] = this.prefix + arguments[0];
    return this.app.all.apply(this.app, arguments);
  }

  _prefix(suffix) {
    return this.prefix + '/' + suffix;
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

}
