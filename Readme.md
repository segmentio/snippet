[![Circle CI](https://circleci.com/gh/segmentio/snippet.svg?style=svg)](https://circleci.com/gh/segmentio/snippet)

# snippet

  Render the analytics.js snippet.

## Example

```js
var snippet = require('snippet');

var contents = snippet.max({
  host: 'cdn.segment.com',
  apiKey: '03fwkuu3',
  page: {
    category: 'Docs',
    name: 'Integrations',
    properties: {
      foo: 'bar'
    }
  }
});
```

## API

### snippet.max(options)

  Returns the maxified version of the analytics.js snippet given a set of `options`:

  * `host`: the domain name where the analytics.js script is hosted
  * `apiKey`: the `apiKey` to load in the snippet
  * `page`: the options to pass to `analytics.page`. if `page` is `false`, then the `page()` call will be omitted


### snippet.min(options)

  Returns the minified version of the snippet.
