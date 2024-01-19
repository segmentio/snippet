'use strict';
/* eslint-disable no-restricted-syntax */

var assert = require('assert');
var render = require('..');
var sinon = require('sinon');

describe('snippet', function() {
  var snippet;
  var sandbox;
  var origConsole;
  var origError;
  
  var bufferedPageContext = {
    __t: 'bpc', 
    c: undefined, 
    p: '/context.html', 
    u: 'http://localhost:9876/context.html', 
    s: '', 
    t: '', 
    r: document.referrer
  };

  var setup = function(options) {
    snippet = Function(render.max(Object.assign({}, {
      // https://app.segment.com/segment-libraries/sources/snippet/settings/keys
      apiKey: 'zCueSsEKipbrRgqbJarlTG8UJsAZWpkm',
    }, options)));
    sandbox = sinon.sandbox.create();
    origConsole = window.console;
    origError = window.console.error;
    window.console.error = function() {
      // prevent this from spewing to the console
      if (arguments[0].match(/Segment snippet included twice/)) {
        return;
      }
      return origConsole.apply(window.console, arguments);
    };
    sandbox.spy(window.console, 'error');
    window.analytics = undefined;
    snippet();
  };

  afterEach(function() {
    sandbox.restore();
    window.console = origConsole;
    window.console.error = origError;
  });

  it('should define a global queue', function() {
    setup()
    assert(window.analytics instanceof Array);
  });

  it('works with different globalAnalyticsKey', function () {
    setup({
      globalAnalyticsKey: 'segment_analytics'
    })

    assert(window.analytics === undefined)
    assert(window.segment_analytics instanceof Array)
    assert(typeof window.segment_analytics.track === 'function')
    assert(typeof window.segment_analytics.identify === 'function')
    // check that the custom global key is exposed to the main runtime through a data attribute
    assert(document.querySelector('script[data-global-segment-analytics-key]').dataset.globalSegmentAnalyticsKey === 'segment_analytics')
  })

  it('should load the script once', function() {
    setup()
    var scripts = document.scripts;
    var length = scripts.length;
    Function(snippet)();
    assert(length === scripts.length);
  });

  it('should set SNIPPET_VERSION to module version', function() {
    setup()
    assert(require('../package.json').version === window.analytics.SNIPPET_VERSION);
  });

  it('should warn using console.error when the snippet is included > 1', function() {
    setup()
    snippet();
    var args = window.console.error.args;
    assert.equal('Segment snippet included twice.', args[0][0]);
  });

  it('should ignore the snippet when the real analytics is already included', function() {
    setup()
    var ajs = { initialize: function() {} };
    window.analytics = ajs;
    snippet();
    var args = window.console.error.args;
    assert.strictEqual(window.analytics, ajs);
    assert.strictEqual(args.length, 0);
  });

  it('should not call .page() again when included > 1', function() {
    setup()
    window.analytics = { invoked: true, page: sandbox.spy() };
    snippet();
    var args = window.analytics.page.args;
    assert.equal(0, args.length);
  });

  it('should not error when window.console is unavailable', function() {
    setup()
    window.analytics.included = true;
    window.console = null;
    snippet();
  });

  describe('.page', function() {
    it('should call .page by default', function() {
      setup()
      assert.strictEqual(window.analytics[0][0], 'page');
    });
  });

  describe('bufferedPageContext', function() {
    ['track', 'screen', 'alias', 'group', 'page', 'identify'].forEach(
      function(method) {
        it(method + ' should have a buffered page context', function() {
          setup()
          window.analytics[method]('foo');
          var lastCall = window.analytics[window.analytics.length - 1];
          assert.deepStrictEqual(lastCall, [method, 'foo', bufferedPageContext]);
        });
      }
    );
  });

  describe('.methods', function() {
    it('should define analytics.js methods', function() {
      setup()
      assert(window.analytics.methods instanceof Array);
    });

    it('.identify', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'identify'));
    });

    it('.track', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'track'));
    });

    it('.trackLink', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'trackLink'));
    });

    it('.trackForm', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'trackForm'));
    });

    it('.trackClick', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'trackClick'));
    });

    it('.trackSubmit', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'trackSubmit'));
    });

    it('.page', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'page'));
    });

    it('.pageview', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'pageview'));
    });

    it('.alias', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'alias'));
    });

    it('.ready', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'ready'));
    });

    it('.group', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'group'));
    });

    it('.on', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'on'));
    });

    it('.once', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'once'));
    });

    it('.off', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'off'));
    });

    it('.addSourceMiddleware', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'addSourceMiddleware'));
    });

    it('.addIntegrationMiddleware', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'addIntegrationMiddleware'));
    });

    it('.setAnonymousId', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'setAnonymousId'));
    });

    it('.addDestinationMiddleware', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'addDestinationMiddleware'));
    });
    
    it('.screen', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'screen'));
    });

    it('.register', function() {
      setup()
      assert(arrayContains(window.analytics.methods, 'register'));
    });
  });

  describe('.factory', function() {
    it('should define a factory', function() {
      setup()
      assert.strictEqual(typeof window.analytics.factory, 'function');
    });

    it('should return a queue stub', function() {
      setup()
      assert.strictEqual(typeof window.analytics.factory('test'), 'function');
    });

    it('should push arguments onto the stub', function() {
      setup()
      var stub = window.analytics.factory('test');
      stub(1, 2, 3);
      var args = window.analytics[window.analytics.length - 1];
      assert.deepEqual(args, ['test', 1, 2, 3]);
    });

    it('should return the analytics object', function() {
      setup()
      var stub = window.analytics.factory();
      assert(window.analytics === stub());
    });

    it('should generate a stub for each method', function() {
      setup()
      for (var i = 0; i < window.analytics.methods.length; i++) {
        var method = window.analytics.methods[i];
        assert.strictEqual(typeof window.analytics[method], 'function');
      }
    });
  });

  describe('.load', function() {
    it('should define a load method', function() {
      setup()
      assert.strictEqual(typeof window.analytics.load, 'function');
    });

    it('should load analytics.js from the server', function(done) {
      setup()
      var id = setInterval(function() {
        if (typeof window.analytics === 'object') {
          clearInterval(id);
          done();
        }
      }, 50);
    });
  });
});

function arrayContains(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === value) {
      return true;
    }
  }
  return false;
}
