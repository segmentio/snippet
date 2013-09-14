
var fs = require('fs')
  , minify = require('uglify-js').minify
  , mkdir = require('mkdirp')
  , path = require('path');


/**
 * Read snippet.
 */

var js = fs.readFileSync(path.resolve(__dirname, './snippet.js'), 'utf8');
var min = minify(js, { fromString: true }).code;


/**
 * Keep a break before `analytics.load` in the minified snippet.
 */

min = min.replace('analytics.load(', '\nanalytics.load(');


/**
 * Write templates.
 */

mkdir(templates());
fs.writeFileSync(templates('snippet.js.handlebars'), js);
fs.writeFileSync(templates('snippet.min.js.handlebars'), min);


/**
 * Return a templates path, with an optional `filename`.
 *
 * @param {String} filename (optional)
 */

function templates (filename) {
  var dir = 'templates';
  if (filename) dir += '/' + filename;
  return path.resolve(__dirname, dir);
}