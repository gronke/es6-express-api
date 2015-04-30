"use strict";

let symbols = {
  level: Symbol('level')
}

module.exports = class Debug {

  constructor() {
    this.level = process.env['DEBUG_LEVEL'] || 1;
  }

  get levels() {
    return {
      'log': 1,
      'error': 2,
      'warn': 3,
      'info': 4
    }
  }

  set level(value) {
    value = parseInt(value, 10);
    for (let tag of Object.keys(this.levels)) {
      if(this.levels[tag] === value) {
        this[symbols.level] = value;
      }
    }
  }

  get level() {
    return this[symbols.level];
  }
  
  isLevelEnabled(tag) {
    return this.level >= this.levels[tag];
  }

  log() {
    if(this.isLevelEnabled('log')) {
      console.log.apply(null, arguments);
    }
  }

  warn() {
    if(this.isLevelEnabled('warn')) {
      console.log.apply(null, arguments);
    }
  }

  info() {
    if(this.isLevelEnabled('info')) {
      console.log.apply(null, arguments);
    }
  }

  error() {
    if(this.isLevelEnabled('error')) {
      console.error.apply(null, arguments);
    }
  }

}
