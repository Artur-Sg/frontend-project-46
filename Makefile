# Makefile

install:
	npm ci

start:
	node gendiff.js -h

test:
	npm test

lint:
	npx eslint .

coverage:
	npm run test-coverage