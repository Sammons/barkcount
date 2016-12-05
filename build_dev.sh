set -ev

#tsc -p src
cp -r static/* dist/
webpack --config=webpack/dev.webpack.js
