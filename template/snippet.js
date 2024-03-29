(function() {
  // define the key where the global analytics object will be accessible
  // customers can safely set this to be something else if need be
  var i = "<%= settings.globalAnalyticsKey %>"

  // Create a queue, but don't obliterate an existing one!
  var analytics = window[i] = window[i] || [];

  // If the real analytics.js is already on the page return.
  if (analytics.initialize) return;

  // If the snippet was invoked already show an error.
  if (analytics.invoked) {
    if (window.console && console.error) {
      console.error("Segment snippet included twice.");
    }
    return;
  }

  // Invoked flag, to make sure the snippet
  // is never invoked twice.
  analytics.invoked = true;

  // A list of the methods in Analytics.js to stub.
  analytics.methods = [
    "trackSubmit",
    "trackClick",
    "trackLink",
    "trackForm",
    "pageview",
    "identify",
    "reset",
    "group",
    "track",
    "ready",
    "alias",
    "debug",
    "page",
    "screen",
    "once",
    "off",
    "on",
    "addSourceMiddleware",
    "addIntegrationMiddleware",
    "setAnonymousId",
    "addDestinationMiddleware",
    "register"
  ];

  // Define a factory to create stubs. These are placeholders
  // for methods in Analytics.js so that you never have to wait
  // for it to load to actually record data. The `method` is
  // stored as the first argument, so we can replay the data.
  analytics.factory = function(e) {
    return function() {
      if (window[i].initialized) {
        // Sometimes users assigned analytics to a variable before analytics is done loading, resulting in a stale reference.
        // If so, proxy any calls to the 'real' analytics instance.
        return window[i][e].apply(window[i], arguments);
      }
      var args = Array.prototype.slice.call(arguments);
      
      // Add buffered page context object so page information is always up-to-date
      if (["track", "screen", "alias", "group", "page", "identify"].indexOf(e) > -1) {
        var c = document.querySelector("link[rel='canonical']");
        args.push({
          __t: "bpc",
          c: c && c.getAttribute("href") || undefined,
          p: location.pathname,
          u: location.href,
          s: location.search,
          t: document.title,
          r: document.referrer
        });
      }

      args.unshift(e);
      analytics.push(args);
      return analytics;
    };
  };


  // For each of our methods, generate a queueing stub.
  for (var j = 0; j < analytics.methods.length; j++) {
    var key = analytics.methods[j];
    analytics[key] = analytics.factory(key);
  }

  // Define a method to load Analytics.js from our CDN,
  // and that will be sure to only ever load it once.
  analytics.load = function(key, options) {
    // Create an async script element based on your key.
    var t = document.createElement("script");
    t.type = "text/javascript";
    t.async = true;
    t.setAttribute("data-global-segment-analytics-key", i)
    t.src = "https://<%= settings.host %><%= settings.ajsPath %>";

    // Insert our script next to the first script element.
    var first = document.getElementsByTagName("script")[0];
    first.parentNode.insertBefore(t, first);
    analytics._loadOptions = options;
  };
  analytics._writeKey = "<%= settings.apiKey %>";

  "<%= settings.optionalCDN %>"

  // Add a version to keep track of what's in the wild.
  analytics.SNIPPET_VERSION = "<%= settings.version %>";

  // Load Analytics.js with your key, which will automatically
  // load the tools you've enabled for your account. Boosh!
  "<%= settings.load %>"

  // Make the first page call to load the integrations. If
  // you'd like to manually name or tag the page, edit or
  // move this call however you'd like.
  "<%= settings.page %>"
})();