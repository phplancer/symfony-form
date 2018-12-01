#!/usr/bin/env bash

## BUILD REF FILES

# 3.4
echo "Updating 3.4 dependencies..."
mv composer.json composer-current.json
mv composer-3.4.json composer.json
composer update
echo "Building 3.4 docs..."
./bin/console app:build
echo "Done."

# 4.0
echo "Updating 4.0 dependencies..."
mv composer.json composer-3.4.json
mv composer-4.0.json composer.json
composer update
echo "Building 4.0 docs..."
./bin/console app:build
echo "Done."

# 4.1
echo "Updating 4.1 dependencies..."
mv composer.json composer-4.0.json
mv composer-4.1.json composer.json
composer update
echo "Building 4.1 docs..."
./bin/console app:build
echo "Done."

# master
echo "Updating MASTER dependencies..."
mv composer.json composer-4.1.json
mv composer-master.json composer.json
composer update
echo "Building MASTER docs..."
./bin/console app:build
echo "Done."

# current
echo "Updating CURRENT dependencies..."
mv composer.json composer-master.json
mv composer-current.json composer.json
composer update
echo "Building CURRENT docs..."
./bin/console app:build
echo "Done."

git status
