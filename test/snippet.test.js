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

  before(function() {
    snippet = Function(render.max({
      // https://app.segment.com/segment-libraries/sources/snippet/settings/keys
      apiKey: 'zCueSsEKipbrRgqbJarlTG8UJsAZWpkm'
    }));
  });

  beforeEach(function() {
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
  });

  afterEach(function() {
    sandbox.restore();
    window.console = origConsole;
    window.console.error = origError;
  });

  it('should define a global queue', function() {
    assert(window.analytics instanceof Array);
  });

  it('should load the script once', function() {
    var scripts = document.scripts;
    var length = scripts.length;
    Function(snippet)();
    assert(length === scripts.length);
  });

  it('should warn using console.error when the snippet is included > 1', function() {
    snippet();
    var args = window.console.error.args;
    assert.equal('Segment snippet included twice.', args[0][0]);
  });

  it('should ignore the snippet when the real analytics is already included', function() {
    var ajs = { initialize: function() {} };
    window.analytics = ajs;
    snippet();
    var args = window.console.error.args;
    assert.strictEqual(window.analytics, ajs);
    assert.strictEqual(args.length, 0);
  });

  it('should not call .page() again when included > 1', function() {
    window.analytics = { invoked: true, page: sandbox.spy() };
    snippet();
    var args = window.analytics.page.args;
    assert.equal(0, args.length);
  });

  it('should not error when window.console is unavailable', function() {
    window.analytics.included = true;
    window.console = null;
    snippet();
  });

  describe('.page', function() {
    it('should call .page by default', function() {
      assert.deepEqual(window.analytics[0], ['page']);
    });
  });

  describe('.methods', function() {
    it('should define analytics.js methods', function() {
      assert(window.analytics.methods instanceof Array);
    });

    it('.identify', function() {
      assert(arrayContains(window.analytics.methods, 'identify'));
    });

    it('.track', function() {
      assert(arrayContains(window.analytics.methods, 'track'));
    });

    it('.trackLink', function() {
      assert(arrayContains(window.analytics.methods, 'trackLink'));
    });

    it('.trackForm', function() {
      assert(arrayContains(window.analytics.methods, 'trackForm'));
    });

    it('.trackClick', function() {
      assert(arrayContains(window.analytics.methods, 'trackClick'));
    });

    it('.trackSubmit', function() {
      assert(arrayContains(window.analytics.methods, 'trackSubmit'));
    });

    it('.page', function() {
      assert(arrayContains(window.analytics.methods, 'page'));
    });

    it('.pageview', function() {
      assert(arrayContains(window.analytics.methods, 'pageview'));
    });

    it('.alias', function() {
      assert(arrayContains(window.analytics.methods, 'alias'));
    });

    it('.ready', function() {
      assert(arrayContains(window.analytics.methods, 'ready'));
    });

    it('.group', function() {
      assert(arrayContains(window.analytics.methods, 'group'));
    });

    it('.on', function() {
      assert(arrayContains(window.analytics.methods, 'on'));
    });

    it('.once', function() {
      assert(arrayContains(window.analytics.methods, 'once'));
    });

    it('.off', function() {
      assert(arrayContains(window.analytics.methods, 'off'));
    });
  });

  describe('.factory', function() {
    it('should define a factory', function() {
      assert.strictEqual(typeof window.analytics.factory, 'function');
    });

    it('should return a queue stub', function() {
      assert.strictEqual(typeof window.analytics.factory('test'), 'function');
    });

    it('should push arguments onto the stub', function() {
      var stub = window.analytics.factory('test');
      stub(1, 2, 3);
      var args = window.analytics[window.analytics.length - 1];
      assert.deepEqual(args, ['test', 1, 2, 3]);
    });

    it('should return the analytics object', function() {
      var stub = window.analytics.factory();
      assert(window.analytics === stub());
    });

    it('should generate a stub for each method', function() {
      for (var i = 0; i < window.analytics.methods.length; i++) {
        var method = window.analytics.methods[i];
        assert.strictEqual(typeof window.analytics[method], 'function');
      }
    });
  });

  describe('.load', function() {
    it('should define a load method', function() {
      assert.strictEqual(typeof window.analytics.load, 'function');
    });

    it('should load analytics.js from the server', function(done) {
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
