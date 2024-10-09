# Makefile

install:
	npm ci

start:
	node gendiff.js -h

lint:
	npx eslint .