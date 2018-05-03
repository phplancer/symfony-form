#!/usr/bin/env bash

# lts
echo "Updating LTS version..."
mv composer.json composer-current.json
mv composer-lts.json composer.json
composer update
./bin/console generate

# master
echo "Updating MASTER version..."
mv composer.json composer-lts.json
mv composer-master.json composer.json
composer update
./bin/console generate

# current
echo "Updating CURRENT version..."
mv composer.json composer-master.json
mv composer-current.json composer.json
composer update
./bin/console generate

git status
