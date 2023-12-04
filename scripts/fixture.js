var fs = require('fs')
var snippet = require('../lib');

fs.writeFileSync("tmp.fixture.min.js", snippet.min({ apiKey: 'YOUR_WRITE_KEY' }), { encoding: 'utf-8' })
fs.writeFileSync("tmp.fixture.max.js", snippet.max({ apiKey: 'YOUR_WRITE_KEY' }), { encoding: 'utf-8' })
