echo "> Start transpiling ES2015"
echo ""
./node_modules/.bin/babel --plugins "transform-runtime" ./ --ignore node_modules,dist --out-dir ./dist
echo ""
echo "> Complete transpiling ES2015"
