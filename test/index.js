
var express = require('express')
  , fs = require('fs')
  , hbs = require('hbs')
  , path = require('path')
  , snippet = require('..')
  , path = require('path');


/**
 * App.
 */

var app = express()
  .use(express.static(__dirname + '/..'))
  .set('views', __dirname)
  .engine('html', hbs.__express)
  .engine('js', hbs.__express);


/**
 * Routes.
 */

app.get('/analytics.js/v1/key/analytics.min.js', function (req, res, next) {
  res.render('analytics.js');
});

app.get('/snippet-test/:min?', function (req, res, next) {
  var template = req.params.min ? snippet.min : snippet.max;
  res.render('index.html', {
    snippet: template({
      apiKey: 'key',
      host: 'localhost:' + port
    }),
    min: !! req.params.min
  });
});


/**
 * Start.
 */

var port = 4321;
var pid = path.resolve(__dirname, 'pid.txt');

app.listen(port, function () {
  fs.writeFileSync(pid, process.pid, 'utf-8');
  console.log('Listening on ' + port + '...');
});