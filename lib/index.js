'use strict';

/**
 * Module Dependencies.
 */

var maxTemplate = require('../dist/max.template');
var minTemplate = require('../dist/min.template');

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
  settings.load = renderLoad(settings);
  settings.page = renderPage(settings.page);
  settings.optionalCDN = renderOptionalCDNHost(settings);

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
  settings.load = renderLoad(settings);
  settings.page = renderPage(settings.page);
  settings.optionalCDN = renderOptionalCDNHost(settings);

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
  options.ajsPath || (options.ajsPath = '/analytics.js/v1/\" + key + \"/analytics.min.js');
  options.useHostForBundles || (options.useHostForBundles = false);

  if (!has.call(options, 'page')) options.page = true;
  if (!has.call(options, 'load')) options.load = true;
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

  var argsStringified = [];

  // eslint-disable-next-line no-restricted-globals
  if (page.category) argsStringified.push(JSON.stringify(page.category));
  // eslint-disable-next-line no-restricted-globals
  if (page.name) argsStringified.push(JSON.stringify(page.name));
  // eslint-disable-next-line no-restricted-globals
  if (page.properties) argsStringified.push(JSON.stringify(page.properties));

  var res = 'analytics.page(' + argsStringified.join(', ') + ');';

  return res;
}

function renderLoad(settings) {
  if (!settings.load) return '';

  if (typeof settings.load !== 'boolean') {
    // eslint-disable-next-line no-restricted-globals
    var loadOptions = JSON.stringify(settings.load);
    return 'analytics.load("' + settings.apiKey + '", ' + loadOptions + ');';
  }

  return 'analytics.load("' + settings.apiKey + '");';
}

function renderOptionalCDNHost(settings) {
  if (!settings) return '';

  if (typeof settings.useHostForBundles === 'boolean' && settings.useHostForBundles) {
    return 'analytics._cdn = "https://' + settings.host + '"';
  }

  return '';
}
