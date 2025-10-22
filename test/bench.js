'use strict';

var Benchmark = require('benchmark');
var snippet = require('../');

var suite = new Benchmark.Suite();

suite
  .add('min', function() {
    snippet.min({});
  })
  .add('max', function() {
    snippet.max({});
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
