#!/usr/bin/env bash

# lts
echo "Updating LTS dependencies..."
mv composer.json composer-current.json
mv composer-lts.json composer.json
composer update
echo "Generating LTS docs..."
./bin/console generate

# master
echo "Updating MASTER dependencies..."
mv composer.json composer-lts.json
mv composer-master.json composer.json
composer update
echo "Generating MASTER docs..."
./bin/console generate

# current
echo "Updating CURRENT dependencies..."
mv composer.json composer-master.json
mv composer-current.json composer.json
composer update
echo "Generating MASTER docs..."
./bin/console generate

git status
