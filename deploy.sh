#!/usr/bin/sh
set -e

# Build
vite build

# Capacitor sync
npx cap sync

# Minify extractors
search_dir=./extractors
for entry in "$search_dir"/*.js
do
  tmp="${entry#*extractors/}"
  fname="${tmp%.*}"
  echo "$fname"
  ./node_modules/.bin/terser ./extractors/"$fname".js --compress --output=./min/"$fname".min.js
done

# Push to git
git add -A
git commit -m "deploy via script"
git push