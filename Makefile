
SRC= test/browser.js
DUO= node_modules/.bin/duo
DUOT= node_modules/.bin/duo-test

test/build.js: node_modules $(SRC)
	@$(DUO) test/browser.js > $@

node_modules: package.json
	@npm install
	@touch $@

clean:
	rm -rf components test/build.js

test:
	@$(DUOT) phantomjs \
		--middleware test/serve.js \
		--commands make \
		--title snippet \
		--reporter spec \
		--port 3000

test-browser:
	@$(DUOT) browser \
		--middleware test/serve.js \
		--commands make \
		--title snippet \
		--port 3000

test-sauce:
	@$(DUOT) saucelabs \
		--browsers $(BROWSERS) \
		--build test/build.js \
		--commands make \
		--title snippet \
		--reporter spec \
		--port 3000

.PHONY: test clean