
/**
 * Module Dependencies.
 */

var snippet = require('..');

/**
 * Serve snippet middleware (Used by duo-test).
 */

module.exports = function(app){
  app.use(function*(next){
    // snippet
    if ('/snippet' == this.path) {
      this.type = 'js';
      this.body = snippet.min({
        apiKey: 'key',
        host: 'localhost:3000'
      });
    }
  
    // analytics.js
    if ('/analytics.js/v1/key/analytics.min.js' == this.path) {
      this.type = 'js';
      this.body = 'loaded = true';
    }

    yield next;
  });
};