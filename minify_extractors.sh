#!/bin/bash
search_dir=./extractors
for entry in "$search_dir"/*.js
do
  tmp="${entry#*extractors/}"
  fname="${tmp%.*}"
  echo "$fname"
  ./node_modules/.bin/terser ./extractors/"$fname".js --compress --output=./minified/"$fname".min.js
done