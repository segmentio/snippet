# @segment/snippet

Render the analytics.js snippet.

The recommended way to use analytics.js is to follow the [analytics.js quickstart guide](https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/quickstart/). If you absolutely need to generate a snippet dynamically, this is an alternate solution. Note that when using this in-browser, the global `analytics` object will not be defined until the snippet is rendered and executed.

For information on browser support, see: https://segment.com/docs/connections/sources/catalog/libraries/website/javascript/supported-browsers/

## Installation
```sh
# npm
npm install @segment/snippet

# yarn
yarn add @segment/snippet

# pnpm
pnpm add @segment/snippet
```
## Example

```js
const snippet = require('@segment/snippet');

const contents = snippet.max({
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

* `host`: the domain name where the analytics.js script is hosted.
* `useHostForBundles`: If set to `true`, the snippet will include the `_cdn` property to tell analytics.js where to fetch bundles from.
* `apiKey`: the `apiKey` to load in the snippet.
* `page`: the options to pass to `analytics.page`. if `page` is `false`, then the `page()` call will be omitted.
* `load`: If object, these are the settings passed as the second argument to analytics.load. This can be useful if you want to override Segment.io integration behavior, or if you want dynamically control which integraions load on the client-side for things like GDPR. If set to `false` the `load()` call will be omitted.
* `ajsPath`: override the default analytics.min.js location


### snippet.min(options)

Returns the minified version of the snippet.


## Development

### Installation + QA
```
nvm use
yarn install
make lint
make test
```

### Running tests in Saucelabs
```
SAUCE=true make test
```

## Releasing
1. Publish to `npm`
```sh
git checkout master && git pull --ff-only
npm version <patch|minor|major>
git push --follow-tags
make build
npm publish
```
2. Create a [new github release](https://github.com/segmentio/snippet/releases).

3. Bump package version on [segmentio/app](https://github.com/segmentio/app/blob/main/packages/app/package.json).

4. Update _all_ example snippets on [public docs repo](https://github.com/segmentio/segment-docs) via search + replace 
- Get example snippet by runnings `yarn fixture` and observing generated `tmp.fixture.*.js` files. 
- Tip: double-check that the fixture's `SNIPPET_VERSION` refers to the new npm version.
