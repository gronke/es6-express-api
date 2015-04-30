"use strict";

exports['Debug output wrapper'] = function(test) {

  var Debug = require('../lib/Debug'),
      debug = require('../lib/functions/debug');

  test.expect(1);
  test.ok(debug instanceof Debug, "debug is instance of Debug");
  test.done();

}

exports['set Debug log level'] = function(test) {

  var Debug = require('../lib/Debug');
  var debug = new Debug();

  test.expect(5);

  test.equal(debug.level, 1, "Default DEBUG_LEVEL is 1 (log)");

  [2,3,4].forEach(function(i) {
    debug.level = i;
    test.equal(debug.level, i, "Can set DEBUG_LEVEL to " + i);
  });

  debug.level = 1;
  debug.level = 99;
  test.equal(debug.level, 1, "Cannot set DEBUG_LEVEL to invalid value");

  test.done();

}