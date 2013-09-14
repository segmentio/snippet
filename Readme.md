# snippet

  Templating methods for the analytics.js snippet.

## Example

```js
var snippet = require('snippet');

var contents = snippet.max({
  host: 'cdn.segment.io',
  apiKey: '03fwkuu3'
});
```

## API

### snippet.max(options)
  
  Returns the maxified version of the analytics.js snippet given a set of `options`:

  * `host`: the domain name where the analytics.js script is hosted
  * `apiKey`: the `apiKey` to load in the snippet

### snippet.min(options)

  Returns the minified version of the snippet.
