
describe('snippet', function () {

  var assert = require('assert');
  var contains = require('contains');
  var equal = require('equals');
  var when = require('when');

  beforeEach(function(){
    window.analytics = null;
    Function(snippet.textContent)();
  })

  it('should define a global queue', function () {
    assert(window.analytics instanceof Array);
  });

  it('should run the snippet once', function(){
    delete window.analytics;
    Function(snippet.textContent)();
    assert(1 == window.analytics.length);
    Function(snippet.textContent)();
    assert(1 == window.analytics.length);
  })

  describe('.page', function () {
    it('should call .page by default', function () {
      assert(equal(window.analytics[0], ['page']));
    });
  });

  describe('.methods', function () {
    it('should define analytics.js methods', function () {
      assert(window.analytics.methods instanceof Array);
    });

    it('.identify', function () {
      assert(contains(window.analytics.methods, 'identify'));
    });

    it('.track', function () {
      assert(contains(window.analytics.methods, 'track'));
    });

    it('.trackLink', function () {
      assert(contains(window.analytics.methods, 'trackLink'));
    });

    it('.trackForm', function () {
      assert(contains(window.analytics.methods, 'trackForm'));
    });

    it('.trackClick', function () {
      assert(contains(window.analytics.methods, 'trackClick'));
    });

    it('.trackSubmit', function () {
      assert(contains(window.analytics.methods, 'trackSubmit'));
    });

    it('.page', function () {
      assert(contains(window.analytics.methods, 'page'));
    });

    it('.pageview', function () {
      assert(contains(window.analytics.methods, 'pageview'));
    });

    it('.alias', function () {
      assert(contains(window.analytics.methods, 'alias'));
    });

    it('.ready', function () {
      assert(contains(window.analytics.methods, 'ready'));
    });

    it('.group', function () {
      assert(contains(window.analytics.methods, 'group'));
    });

    it('.on', function () {
      assert(contains(window.analytics.methods, 'on'));
    });

    it('.once', function () {
      assert(contains(window.analytics.methods, 'once'));
    });

    it('.off', function () {
      assert(contains(window.analytics.methods, 'off'));
    });
  });

  describe('queue', function(){
    analytics.methods.forEach(function(method){
      it('should queue .' + method + '() calls with the correct arguments', function(){
        analytics.pop(); // remove page call.
        analytics[method](1, 2, 3);
        assert(1 == analytics.length);
        assert.deepEqual([method, 1, 2, 3], analytics[0]);
        analytics[method]([]);
        assert(2 == analytics.length);
        assert.deepEqual([method, []], analytics[1]);
      })
    })
  })

  describe('.load', function () {
    it('should load analytics.js from the server', function (done) {
      delete window.analytics;
      Function(snippet.textContent)();
      when(function () { return window.loaded; }, done);
    });
  });

});
