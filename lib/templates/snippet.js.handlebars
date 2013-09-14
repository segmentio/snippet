// Create a queue, but don't obliterate an existing one!
window.analytics || (window.analytics = []);

// A list of all the methods in analytics.js that we want to stub.
analytics.methods = ['identify', 'track', 'trackLink', 'trackForm',
'trackClick', 'trackSubmit', 'page', 'pageview', 'ab', 'alias', 'ready',
'group'];

// Define a factory to create queue stubs. These are placeholders for the
// "real" methods in analytics.js so that you never have to wait for the library
// to load asynchronously to actually track things. The `method` is always the
// first argument, so we know which method to replay the call into.
analytics.factory = function (method) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(method);
    analytics.push(args);
  };
};

// For each of our methods, generate a queueing method.
for (var i = 0; i < analytics.methods.length; i++) {
  var method = analytics.methods[i];
  analytics[method] = analytics.factory(method);
}

// Define a method that will asynchronously load analytics.js from our CDN.
analytics.load = function (apiKey) {

  // Create an async script element for analytics.js based on your API key.
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = ('https:' === document.location.protocol ? 'https://' : 'http://') +
                '{{{ host }}}/analytics.js/v1/' + apiKey + '/analytics.min.js';

  // Find the first script element on the page and insert our script next to it.
  var firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode.insertBefore(script, firstScript);
};

// Add a version so we can keep track of what's out there in the wild.
analytics.SNIPPET_VERSION = '2.0.0';

// Load analytics.js with your API key, which will automatically load all of the
// analytics integrations you've turned on for your account. Boosh!
analytics.load('{{{ apiKey }}}');
