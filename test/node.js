
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