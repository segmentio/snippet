##
# Binaries
##

ESLINT := node_modules/.bin/eslint
KARMA := node_modules/.bin/karma
MATCHA := node_modules/.bin/matcha
MOCHA := node_modules/.bin/mocha
_MOCHA := node_modules/.bin/_mocha

##
# Files
##

LIBS = $(shell find lib -type f -name "*.js")
TESTS = $(shell find test -type f -name "*.test.js")
SUPPORT = $(wildcard karma.conf*.js)
ALL_FILES = $(LIBS) $(TESTS) $(SUPPORT)

##
# Program options/flags
##

# A list of options to pass to Karma
# Overriding this overwrites all options specified in this file (e.g. BROWSERS)
KARMA_FLAGS ?=

# A list of Karma browser launchers to run
# http://karma-runner.github.io/0.13/config/browsers.html
BROWSERS ?=
ifdef BROWSERS
KARMA_FLAGS += --browsers $(BROWSERS)
endif

ifeq ($(SAUCE), true)
	KARMA_CONF ?= karma.conf.sauce.js
else
	KARMA_CONF ?= karma.conf.js
endif

# Mocha flags.
GREP ?= .
MOCHA_REPORTER ?= spec
MOCHA_FLAGS := \
	--reporter "$(MOCHA_REPORTER)" \
	--ui bdd

##
# Tasks
##

# Install node modules.
node_modules: package.json $(wildcard node_modules/*/package.json)
	yarn install --immutable
	@touch $@

# Install dependencies.
install: node_modules

build: install
	@node scripts/build.js
.PHONY: build


fixture: install build
	@node scripts/fixture.js
.PHONY: fixture

# Remove temporary files and build artifacts.
clean:
	rm -rf *.log coverage
.PHONY: clean

# Remove temporary files, build artifacts, and vendor dependencies.
distclean: clean
	rm -rf node_modules
.PHONY: distclean

# Lint JavaScript source files.
lint: install build
	@$(ESLINT) template/** lib/** scripts/** test/**
.PHONY: lint

# Attempt to fix linting errors.
fmt: build
	@$(ESLINT) --fix $(ALL_FILES)
.PHONY: fmt

bench: install build
	@$(MATCHA) test/bench.js
.PHONY: bench

# Run unit tests in node.
test-node: install build
	@echo "-> Mocha: render.test.js"
	@NODE_ENV=test  $(_MOCHA) -- $(MOCHA_FLAGS) test/render.test.js
.PHONY: test-node

# Run browser unit tests in a browser.
test-browser: install build
	@echo "-> Karma: start..."
	@$(KARMA) start $(KARMA_FLAGS) $(KARMA_CONF)
.PHONY: test-browser

# Default test target.
test: bench test-node test-browser
.PHONY: test
.DEFAULT_GOAL = test
