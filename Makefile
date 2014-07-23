
TEST = http://localhost:4321/snippet-test
PHANTOM = node_modules/.bin/mocha-phantomjs --setting web-security=false --setting local-to-remote-url-access=true
MOCHA = node_modules/.bin/mocha
COMPONENT = node_modules/component/bin/component

build: install
	@$(COMPONENT) build --dev

install: package.json component.json
	@$(COMPONENT) install --dev
	@npm install .

clean:
	@rm -rf build components

server: kill
	@node test/index.js &
	@sleep 1

kill:
	@-test -e test/pid.txt \
		&& kill -9 `cat test/pid.txt` \
		&& rm test/pid.txt

test: build test-node server
	@$(PHANTOM) $(TEST)
	@$(PHANTOM) $(TEST)/min
	@make kill


test-node: build
	@$(MOCHA) --require should --reporter spec test/node.js

test-browser: build server
	@sleep 1
	@open $(TEST)
	@open $(TEST)/min

.PHONY: build clean templates test
