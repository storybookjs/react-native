'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupGraphiQL = setupGraphiQL;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _graphiql = require('graphiql');

var _graphiql2 = _interopRequireDefault(_graphiql);

var _FullScreen = require('./components/FullScreen');

var _FullScreen2 = _interopRequireDefault(_FullScreen);

require('graphiql/graphiql.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FETCH_OPTIONS = {
  method: 'post',
  headers: { 'Content-Type': 'application/json' }
};

function getDefautlFetcher(url) {
  return function (params) {
    var body = JSON.stringify(params);
    var options = Object.assign({ body: body }, FETCH_OPTIONS);
    return fetch(url, options).then(function (res) {
      return res.json();
    });
  };
}

function reIndentQuery(query) {
  var lines = query.split('\n');
  var spaces = lines[lines.length - 1].length - 1;
  return lines.map(function (l, i) {
    return i === 0 ? l : l.slice(spaces);
  }).join('\n');
}

function setupGraphiQL(config) {
  return function (_query) {
    var variables = arguments.length <= 1 || arguments[1] === undefined ? '{}' : arguments[1];

    var query = reIndentQuery(_query);
    var fetcher = config.fetcher || getDefautlFetcher(config.url);
    return function () {
      return _react2.default.createElement(
        _FullScreen2.default,
        null,
        _react2.default.createElement(_graphiql2.default, { query: query, variables: variables, fetcher: fetcher })
      );
    };
  };
}