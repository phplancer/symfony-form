#!/usr/bin/env bash

## BUILD REF FILES

# 3.4
echo "Updating 3.4 dependencies..."
mv composer.json composer-current.json
mv composer-3.4.json composer.json
rm -rf vendor && rm composer.lock
composer update
echo "Building 3.4 docs..."
./bin/console app:build
echo "Done."

# 4.3
echo "Updating 4.3 dependencies..."
mv composer.json composer-3.4.json
mv composer-4.3.json composer.json
rm -rf vendor && rm composer.lock
composer update
echo "Building 4.3 docs..."
./bin/console app:build
echo "Done."

# 4.4
echo "Updating 4.4 dependencies..."
mv composer.json composer-4.3.json
mv composer-4.4.json composer.json
rm -rf vendor && rm composer.lock
composer update
echo "Building 4.4 docs..."
./bin/console app:build
echo "Done."

# 5.0
echo "Updating 5.0 dependencies..."
mv composer.json composer-4.4.json
mv composer-5.0.json composer.json
rm -rf vendor && rm composer.lock
composer update
echo "Building 5.0 docs..."
./bin/console app:build
echo "Done."

# master
echo "Updating MASTER dependencies..."
mv composer.json composer-5.0.json
mv composer-master.json composer.json
rm -rf vendor && rm composer.lock
composer update
echo "Building MASTER docs..."
./bin/console app:build
echo "Done."

# current
echo "Updating CURRENT dependencies..."
mv composer.json composer-master.json
mv composer-current.json composer.json
rm -rf vendor && rm composer.lock
composer update
echo "Building CURRENT docs..."
./bin/console app:build
echo "Done."

git status
