
var fs = require('fs');
var handlebars = require('handlebars');
var minify = require('minify');
var path = require('path');
var format = require('util').format;

/**
 * Has convenience alias
 */

var has = Object.prototype.hasOwnProperty;

/**
 * The template file to use.
 */

var templateFile = path.resolve(__dirname, './snippet.handlebars');

/**
 * the template file contents
 */

var template = fs.readFileSync(templateFile, 'utf8');

/**
 * The compiled versions of the template
 */

var max = handlebars.compile(template);
var min = handlebars.compile(minify.js(template));

/**
 * Return the maxified templating function.
 *
 * @param {Object} options (optional)
 * @return {String} rendered
 */

exports.max = function (options) {
  var locals = defaults(options);
  return max(locals) + renderPage(locals.page);
};


/**
 * Return the minified templating function.
 *
 * @param {Object} options
 * @return {String} min
 */

exports.min = function (options) {
  var locals = defaults(options);
  var snippet = min(locals) + renderPage(locals.page);
  var match = /(window.analytics.load\()|(window.analytics.page\()/g;
  snippet = linebreak(snippet, match);
  return snippet;
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
  options.host || (options.host = 'cdn.segment.com');
  if (!has.call(options, 'page')) options.page = true;
  return options;
}

/**
 * Handlebars helper which will render the window.analytics.page call.
 * By default just render the empty call, adding whatever arguments are
 * passed in explicitly.
 *
 * @param {Object|Boolean} page options (name, category, properties)
 * @return {String} window.analytics.page snippet
 */

function renderPage (page) {
  if (!page) return '';
  if (typeof page === 'boolean') return stringify([]);

  var args = [];
  if (page.category) args.push(page.category);
  if (page.name) args.push(page.name);
  if (page.properties) args.push(page.properties);
  return stringify(args);

  function stringify(args) {
    args = args
      .map(JSON.stringify)
      .join(', ');
    return format('window.analytics.page(%s);', args);
  }
}


/**
 * Preserve the linebreak for a `regex` in `string`
 *
 * @param {String} string
 * @param {RegExp} regex
 * @return {String}
 */

function linebreak (string, regex) {
  return string.replace(regex, function (match) { return '\n' + match; });
}
