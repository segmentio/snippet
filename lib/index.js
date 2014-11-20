
/**
 * Module Dependencies.
 */

var handlebars = require('handlebars');
var read = require('fs').readFileSync;
var fmt = require('util').format;
var join = require('path').join;
var minify = require('minify');
var path = require('path');
var fs = require('fs');

/**
 * Compression options.
 */

var compress = {
  mangle: { except: ['analytics'] },
  compress: { sequences: false },
};

/**
 * Has convenience alias
 */

var has = Object.prototype.hasOwnProperty;

/**
 * The template file to use.
 */

var template = read(join(__dirname, './snippet.js'), 'utf-8');

/**
 * The compiled versions of the template
 */

var snippet = handlebars.compile(template);

/**
 * Return the maxified templating function.
 *
 * @param {Object} options (optional)
 * @return {String} rendered
 */

exports.max = function(options){
  var locals = defaults(options);
  var locals = defaults(options);
  locals.load = fmt('analytics.load(%s)', JSON.stringify(locals.apiKey));
  locals.page = renderPage(locals.page);
  return snippet(locals);
};

/**
 * Return the minified templating function.
 *
 * @param {Object} options
 * @return {String} min
 */

exports.min = function(options){
  var js = exports.max(options);
  var min = minify.js(js, compress);
  var regexp = /(analytics.load\(|analytics.page\(|}}\(\);)/g;
  return linebreak(min, regexp);
};

/**
 * Back an options object with the snippet defaults.
 *
 * @param {Object} options (optional)
 * @return {Object}
 */

function defaults(options){
  options || (options = {});
  options.apiKey || (options.apiKey = 'YOUR_API_KEY');
  options.host || (options.host = 'cdn.segment.com');
  if (!has.call(options, 'page')) options.page = true;
  return options;
}

/**
 * Handlebars helper which will render the window.analytics.page call.
 *
 * By default just render the empty call, adding whatever arguments are
 * passed in explicitly.
 *
 * @param {Object|Boolean} page options (name, category, properties)
 * @return {String}
 */

function renderPage(page){
  if (!page) return '';

  var args = [];

  if (page.category) args.push(page.category);
  if (page.name) args.push(page.name);
  if (page.properties) args.push(page.properties);

  return fmt('analytics.page(%s);', args
    .map(JSON.stringify)
    .join(', '));
}

/**
 * Preserve the linebreak for a `regex` in `string`
 *
 * @param {String} string
 * @param {RegExp} regex
 * @return {String}
 */

function linebreak(string, regex){
  return string.replace(regex, '\n$1');
}
