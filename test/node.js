
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
    snippet.max({ apiKey: 'key' }).should.include('analytics.load(\'key\')');
  });

  it('should not include page if explicitly omitted', function () {
    snippet.max({ page: false }).should.not.include('analytics.page()');
  });

  it('should include page by default', function () {
    snippet.max({}).should.include('analytics.page()');
  });

  it('should omit page.category if not provided', function () {
    snippet.max({ page: { name: 'Signup' }}).should.include('analytics.page("Signup");');
  });

  it('should set the full page options', function () {
    var page = {
      category: 'Docs',
      name: 'Integrations',
      properties: {
        foo: 'bar'
      }
    };
    snippet.max({ page: page }).should.include('analytics.page("Docs", "Integrations", {"foo":"bar"});');
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

  it('should separate out the page and load calls', function () {
    var min = snippet.min();
    min.split('\n').should.have.lengthOf(3);
  });
});

});
