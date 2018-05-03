#!/usr/bin/env bash

# lts
mv composer.json composer-current.json
mv composer-lts.json composer.json
composer update
./bin/console generate

# master
mv composer.json composer-lts.json
mv composer-master.json composer.json
composer update
./bin/console generate

# current
mv composer.json composer-master.json
mv composer-current.json composer.json
composer update
./bin/console generate

git status
