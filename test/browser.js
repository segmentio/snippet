
describe('snippet', function () {

  var assert = require('component/assert');
  var when = require('segmentio/when');
  var spy = require('segmentio/spy');
  var snippet;

  before(function(){
    var req = new XMLHttpRequest;
    req.open('GET', '/snippet', false);
    req.send();
    snippet = req.responseText;
    if (200 != req.status) throw new Error('can\'t get /snippet (' + req.status + ')');
  });

  it('should define a global queue', function () {
    assert(window.analytics instanceof Array);
  });

  it('should load the script once', function(){
    var scripts = document.scripts;
    var length = scripts.length;
    Function(snippet)();
    assert(length == scripts.length);
  });

  it('should warn using console.error when the snippet is included > 1', function(){
    var global = {};
    global.window = global;
    global.analytics = { invoked: true };
    global.console = { error: spy() };
    with (global) eval(snippet);
    var args = global.console.error.args;
    assert.equal('Segment snippet included twice.', args[0][0]);
  });

  it('should ignore the snippet when the real analytics is already included', function(){
    var global = {};
    var ajs = { initialize: function(){} };
    global.window = global;
    global.analytics = ajs;
    global.console = { error: spy() };
    with (global) eval(snippet);
    var args = global.console.error.args;
    assert.equal(ajs, global.analytics);
    assert.equal(0, args.length);
  });

  it('should not call .page() again when included > 1', function(){
    var global = {};
    global.window = global;
    global.analytics = { invoked: true, page: spy() };
    global.console = { error: spy() };
    with (global) eval(snippet);
    var args = global.analytics.page.args;
    assert.equal(0, args.length)
  })

  it('should not error when window.console is unavailable', function(){
    window.analytics.included = true;
    var scripts = document.getElementsByTagName('script');
    var c = console;
    window.console = null;
    Function(snippet.textContent)();
    window.console = c;
  });

  describe('.page', function () {
    it('should call .page by default', function () {
      assert.deepEqual(window.analytics[0], ['page']);
    });
  });

  describe('.methods', function () {
    it('should define analytics.js methods', function () {
      assert(window.analytics.methods instanceof Array);
    });

    it('.identify', function () {
      assert(~window.analytics.methods.indexOf('identify'));
    });

    it('.track', function () {
      assert(~window.analytics.methods.indexOf('track'));
    });

    it('.trackLink', function () {
      assert(~window.analytics.methods.indexOf('trackLink'));
    });

    it('.trackForm', function () {
      assert(~window.analytics.methods.indexOf('trackForm'));
    });

    it('.trackClick', function () {
      assert(~window.analytics.methods.indexOf('trackClick'));
    });

    it('.trackSubmit', function () {
      assert(~window.analytics.methods.indexOf('trackSubmit'));
    });

    it('.page', function () {
      assert(~window.analytics.methods.indexOf('page'));
    });

    it('.pageview', function () {
      assert(~window.analytics.methods.indexOf('pageview'));
    });

    it('.alias', function () {
      assert(~window.analytics.methods.indexOf('alias'));
    });

    it('.ready', function () {
      assert(~window.analytics.methods.indexOf('ready'));
    });

    it('.group', function () {
      assert(~window.analytics.methods.indexOf('group'));
    });

    it('.on', function () {
      assert(~window.analytics.methods.indexOf('on'));
    });

    it('.once', function () {
      assert(~window.analytics.methods.indexOf('once'));
    });

    it('.off', function () {
      assert(~window.analytics.methods.indexOf('off'));
    });
  });

  describe('.factory', function () {
    it('should define a factory', function () {
      assert('function' == typeof window.analytics.factory);
    });

    it('should return a queue stub', function () {
      assert('function' == typeof window.analytics.factory('test'));
    });

    it('should push arguments onto the stub', function () {
      var stub = window.analytics.factory('test');
      stub(1, 2, 3);
      var args = window.analytics[window.analytics.length - 1];
      assert.deepEqual(args, ['test', 1, 2, 3]);
    });

    it('should return the analytics object', function () {
      var stub = window.analytics.factory();
      assert(window.analytics == stub());
    });

    it('should generate a stub for each method', function () {
      for (var i = 0, method; method = window.analytics.methods[i]; i++) {
        assert('function' == typeof window.analytics[method]);
      }
    });
  });

  describe('.load', function () {
    it('should define a load method', function () {
      assert('function' == typeof window.analytics.load);
    });

    it('should load analytics.js from the server', function (done) {
      when(function () { return window.loaded; }, done);
    });
  });

});
