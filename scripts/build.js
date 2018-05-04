'use strict';

var fs = require('fs');
var path = require('path');
var template = require('lodash/template');
var minify = require('uglify-js').minify;
var mkdirp = require('mkdirp');

var source = fs.readFileSync(path.join(__dirname, '../template/snippet.js'), { encoding: 'utf8' });

var loadRegex = /['"](<%= settings\.load %>)['"];?/;
var pageRegex = /['"](<%= settings\.page %>)['"]/;
var lineRegex = /(<%= settings\.load %>|<%= settings\.page %>|}}\(\);)/g;

var snippet = template(source.replace(loadRegex, '$1').replace(pageRegex, '$1'), { variable: 'settings' });
var snippetMin = template(minify(source, {
  mangle: { except: ['analytics'] },
  compress: { sequences: false, side_effects: false },
  fromString: true
}).code.replace(loadRegex, '$1').replace(pageRegex, '$1').replace(lineRegex, '\n$1'), { variable: 'settings' });

mkdirp(path.join(__dirname, '../dist'), function() {
  fs.writeFileSync(path.join(__dirname, '../dist/max.template.js'), 'module.exports=' + snippet.source);
  fs.writeFileSync(path.join(__dirname, '../dist/min.template.js'), 'module.exports=' + snippetMin.source);
});
