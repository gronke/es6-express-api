'use strict';

var path = require('path');

let debug = function() { 
  console.log.apply(null, arguments); 
};

let symbols = {
  prefix: Symbol('route'),
  options: Symbol('options')
}

let defaults = {
  prefix: '/',
  base_dir: '..'
}

module.exports = class Route {

  constructor(prefix, app, options) {

    debug('Initializing new Route', prefix);

    this.options = options;
    
    this.prefix = prefix || defaults.prefix;
    this.app = app;
    this.base_dir = this.options.base_dir || defaults.base_dir;

    this._loadRoute();

  }

  follow(suffix) {
    return new Route(this._prefix(suffix), this.app);
  }

  get() {
    arguments[0] = this.prefix + arguments[0];
    return this.app.get.apply(this.app, arguments);
  }

  post() {
    return this.app.post(arguments);
  }

  all() {
    return this.app.all(arguments);
  }

  _prefix(suffix) {
    return this.prefix + '/' + suffix;
  }

  _loadRoute() {
    debug('Load Route from', this.path);
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
    return this[symbols.options];
  }

  get path() {
    return path.join(__dirname, this.base_dir, this.prefix);
  }

}