var snippet = require('./');
var start;
var elapsed;

start = Date.now();
for (var i = 0; i < 10000; i++) { var x = snippet.max({}); }
elapsed = Date.now() - start;

console.log('10000 Max: ', elapsed);

start = Date.now();
for (var i = 0; i < 10000; i++) { var x = snippet.min({}); }
elapsed = Date.now() - start;

console.log('10000 Min: ', elapsed);