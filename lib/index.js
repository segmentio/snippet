'use strict';

/**
 * Module Dependencies.
 */

var maxTemplate = require('../dist/max.template');
var minTemplate = require('../dist/min.template');
var json = require('json3/lib/json3.min');

/**
 * Has convenience alias
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Return the maxified templating function.
 *
 * @param {Object} options (optional)
 * @return {String} rendered
 */

exports.max = function(options) {
  var settings = defaults(options);
  settings.page = renderPage(settings.page);
  return maxTemplate(settings);
};

/**
 * Return the minified templating function.
 *
 * @param {Object} options
 * @return {String} min
 */

exports.min = function(options) {
  var settings = defaults(options);
  settings.page = renderPage(settings.page);
  return minTemplate(settings);
};

/**
 * Back an options object with the snippet defaults.
 *
 * @param {Object} options (optional)
 * @return {Object}
 */

function defaults(options) {
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

function renderPage(page) {
  if (!page) return '';

  var args = [];

  if (page.category) args.push(page.category);
  if (page.name) args.push(page.name);
  if (page.properties) args.push(page.properties);

  var res = 'analytics.page(';
  for (var i = 0; i < args.length; i++) {
    if (i !== 0) {
      res += ', ';
    }
    res += json.stringify(args[i]);
  }
  res += ');';

  return res;
}
