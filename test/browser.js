
describe('snippet', function () {

var assert = require('assert')
  , contains = require('contains')
  , equal = require('equals')
  , when = require('when');

it('should define a global queue', function () {
  assert(window.analytics instanceof Array);
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

  it('.ab', function () {
    assert(contains(window.analytics.methods, 'ab'));
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
    assert(equal(window.analytics[0], ['test', 1, 2, 3]));
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