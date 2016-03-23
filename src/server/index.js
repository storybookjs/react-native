#!/usr/bin/env node

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var getIndexHtml = require('./index.html');
var getIframeHtml = require('./iframe.html');
var config = require('./webpack.config');

var app = new (require('express'))()
var port = process.argv[2]? parseInt(process.argv[2]) : 4000;

var compiler = webpack(config)
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))

app.get("/", function(req, res) {
  res.send(getIndexHtml());
});

app.get("/iframe", function(req, res) {
  res.send(getIframeHtml());
});

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("React Storybook started on => http://localhost:%s/ \n", port)
  }
})
