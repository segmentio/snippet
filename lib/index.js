
var fs = require('fs')
  , handlebars = require('handlebars')
  , path = require('path');


/**
 * Compiled templates.
 */

var max = template('snippet.js.handlebars');
var min = template('snippet.min.js.handlebars');


/**
 * Return the maxified templating function.
 *
 * @param {Object} options (optional)
 */

exports.max = function (options) {
  return max(defaults(options));
};


/**
 * Return the minified templating function.
 *
 * @param {Object} options
 */

exports.min = function (options) {
  return min(defaults(options));
};


/**
 * Back an options object with the snippet defaults.
 *
 * @param {Object} options (optional)
 * @return {Object}
 */

function defaults (options) {
  options || (options = {});
  options.apiKey || (options.apiKey = 'YOUR_API_KEY');
  options.host || (options.host = 'localhost');
  return options;
}


/**
 * Compile a template function from a template `filename`.
 *
 * @param {String} filename
 */

function template (filename) {
  var file = path.resolve(__dirname, 'templates/' + filename);
  var contents = fs.readFileSync(file, 'utf8');
  return handlebars.compile(contents);
}