#!/usr/bin/sh
set -e

# Build
vite build

# Capacitor sync
printf "\nSyncing to Android...\n"
npx cap sync

# Minify extractors
printf "\nMinifying extractors...\n"
search_dir=./extractors
for entry in "$search_dir"/*.js
do
  tmp="${entry#*extractors/}"
  fname="${tmp%.*}"
  echo "$fname"
  ./node_modules/.bin/terser ./extractors/"$fname".js --compress --output=./docs/min/"$fname".min.js
done

# Copy README to docs
printf "\nCopying README to docs...\n"
cp README.md ./docs/

# Push to git
printf "\nPushing to git...\n"
git add -A
git commit -m "deploy via script"
git push