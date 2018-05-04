#!/usr/bin/env bash

## BUILD DOCS

# lts
echo "Updating LTS dependencies..."
mv composer.json composer-current.json
mv composer-lts.json composer.json
composer update
echo "Building LTS docs..."
./bin/console app:build

# master
echo "Updating MASTER dependencies..."
mv composer.json composer-lts.json
mv composer-master.json composer.json
composer update
echo "Building MASTER docs..."
./bin/console app:build

# current
echo "Updating CURRENT dependencies..."
mv composer.json composer-master.json
mv composer-current.json composer.json
composer update
echo "Building MASTER docs..."
./bin/console app:build

git status
