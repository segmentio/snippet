'use strict';
/* global bench */

var snippet = require('../');

bench('min', function() {
  snippet.min({});
});

bench('max', function() {
  snippet.max({});
});
