
describe('snippet', function () {

var snippet = require('..');

describe('#max', function () {
  it('should be a template function', function () {
    snippet.max.should.be.a.function;
  });

  it('should return a string', function () {
    snippet.max().should.be.a.string;
  });

  it('should set the host', function () {
    snippet.max({ host: 'example.com' }).should.include('example.com/analytics.js/v1');
  });

  it('should set the api key', function () {
    snippet.max({ apiKey: 'key' }).should.include('window.analytics.load(\'key\')');
  });

  it('should not include page if explicitly omitted', function () {
    snippet.max({ page: false }).should.not.include('window.analytics.page()');
  });

  it('should include page by default', function () {
    snippet.max({}).should.include('window.analytics.page()');
  });

  it('should omit page.category if not provided', function () {
    snippet.max({ page: { name: 'Signup' }}).should.include('window.analytics.page("Signup");');
  });

  it('should set the full page options', function () {
    var page = {
      category: 'Docs',
      name: 'Integrations',
      properties: {
        foo: 'bar'
      }
    };
    snippet.max({ page: page }).should.include('window.analytics.page("Docs", "Integrations", {"foo":"bar"});');
  });
});

describe('#min', function () {
  it('should be a template function', function () {
    snippet.min.should.be.a.function;
  });

  it('should return a string', function () {
    snippet.min().should.be.a.string;
  });

  it('should set the host', function () {
    snippet.min({ host: 'example.com' }).should.include('example.com/analytics.js/v1');
  });

  it('should set the api key', function () {
    snippet.min({ apiKey: 'key' }).should.include('analytics.load("key")');
  });

  it('should be shorter than max', function () {
    var max = snippet.max().length;
    var min = snippet.min().length;
    min.should.be.below(max);
  });
});

});