'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Database = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

exports.default = function (configDir) {
  var dbPath = _path2.default.resolve(configDir, 'datastore.json');
  var db = new Database(dbPath);

  var router = new _express.Router();
  router.use(_bodyParser2.default.json());

  router.post('/get', function (req, res) {
    var _req$body = req.body;
    var collection = _req$body.collection;
    var query = _req$body.query;
    var sort = _req$body.sort;
    var limit = _req$body.limit;

    var out = db.get(collection, query, sort, limit);
    res.send({ data: out });
    res.end();
  });

  router.post('/set', function (req, res) {
    var _req$body2 = req.body;
    var collection = _req$body2.collection;
    var item = _req$body2.item;

    var out = db.set(collection, item);
    res.send({ data: out });
    res.end();
  });

  return router;
};

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _fileAsync = require('lowdb/lib/file-async');

var _fileAsync2 = _interopRequireDefault(_fileAsync);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Database = exports.Database = function () {
  function Database(dbPath) {
    (0, _classCallCheck3.default)(this, Database);

    this.db = (0, _lowdb2.default)(dbPath, { storage: _fileAsync2.default });
  }

  (0, _createClass3.default)(Database, [{
    key: 'get',
    value: function get(collection, query, sort, limit) {
      // if the database doesn't exist, add the document
      // and return the inserted document as the result.
      if (!this.db.has(collection).value()) {
        return [];
      }
      // If the sort param is not given, use the DB interface
      if (!sort) {
        return this.db.get(collection).filter(query).take(limit).value();
      }
      // The db does not support sorting by multiple keys, get all data
      // and sort it by each key (and its order) and then apply the limit
      var allDocs = this.db.get(collection).filter(query).value();
      var sorted = (0, _keys2.default)(sort).reduce(function (unsorted, key) {
        return unsorted.sort(function (x, y) {
          var order = sort[key];
          return x[key] > y[key] ? order * 1 : order * -1;
        });
      }, allDocs);
      // apply the limit after sorting
      return sorted.slice(0, limit);
    }
  }, {
    key: 'set',
    value: function set(collection, item) {
      // if the database doesn't exist, add the item
      // and return the inserted item as the result.
      if (!this.db.has(collection).value()) {
        this.db.set(collection, [item]).value();
        return item;
      }
      // if the item already exists in the database, update it
      if (this.db.get(collection).find({ id: item.id }).value()) {
        this.db.get(collection).find({ id: item.id }).assign(item).value();
        return item;
      }
      // If the item is not available in the database, insert it
      var coll = this.db.get(collection).value();
      this.db.set(collection, [].concat((0, _toConsumableArray3.default)(coll), [item])).value();
      return item;
    }
  }]);
  return Database;
}();