'use strict';

module.exports = function() {
  return function(req, res, next) {
    if (req.url === '/analytics.js/v1/key/analytics.min.js') {
      res.writeHead(200);
      res.end('loaded = true');
      return;
    }
    next();
  };
};
