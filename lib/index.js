
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
 * The compiled version of the template
 */

var template = handlebars.compile(fs.readFileSync(templateFile, 'utf8'));


/**
 * Return the maxified templating function.
 *
 * @param {Object} options (optional)
 * @return {String} rendered
 */

exports.max = function (options) {
  return render(options);
};


/**
 * Return the minified templating function.
 *
 * @param {Object} options
 * @return {String} min
 */

exports.min = function (options) {
  var min = minify.js(render(options));
  min = linebreak(min, 'window.analytics.load(');
  min = linebreak(min, 'window.analytics.page(');
  return min;
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
  options.host || (options.host = 'd2dq2ahtl5zl1z.cloudfront.net');
  if (!has.call(options, 'page')) options.page = true;
  return options;
}


/**
 * Compile a template function from a template `filename`.
 *
 * @param {String} filename
 */

function render (options) {
  var locals = defaults(options);
  locals.renderedPage = renderPage(locals.page);
  return template(locals);
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
 * Preserve the linebreak for a line `prefix` in `string`
 *
 * @param {String} string
 * @param {String} prefix
 * @return {String}
 */

function linebreak (string, prefix) {
  return string.replace(prefix, '\n' + prefix);
}