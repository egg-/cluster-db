/**
 * @file cluster.js
 */

var util = require('util')
var events = require('events')
var mysql = require('mysql')

/**
 * pool cluster wrapper module for multiple hosts connection
 * @class
 */
function Cluster () {
  events.EventEmitter.call(this)

  this._driver = null
  this._cluster = null
}

util.inherits(Cluster, events.EventEmitter)

/**
 * Class of cluster
 * @memberof Cluster.prototype
 * @type Cluster
 */
Cluster.prototype.Cluster = Cluster

/**
 * check initialized driver.
 * @memberof Cluster.prototype
 * @private
 */
Cluster.prototype._load = function (cb) {
  if (this._cluster === null) {
    cb(new Error('not initializted driver.'))
    return false
  }

  return true
}

/**
 * load driver
 * @method  load
 * @memberof Cluster.prototype
 * @param {string} driver database driver
 * @param {Cluster~loadCallback} cb The callback that handle the results
 */
Cluster.prototype.load = function (driver, cb) {
  cb = Cluster.cb(cb)

  var self = this

  if (this._cluster !== null) {
    return cb(new Error('The driver is already loaded. Please unload the driver first.'))
  }

  if (driver === 'mysql') {
    this._driver = driver
    this._cluster = mysql.createPoolCluster()
    this._cluster.on('remove', function (id) {
      self.emit('remove', id)
    })
  } else {
    return cb(new Error('not available driver.'))
  }

  cb(null, driver)
}

/**
 * unload driver
 * @method  unload
 * @memberof Cluster.prototype
 * @param {Cluster~callback} cb The callback that handle the results
 */
Cluster.prototype.unload = function (cb) {
  cb = Cluster.cb(cb)

  if (this._cluster !== null) {
    var self = this
    return this._cluster.end(function (err) {
      self._driver = null
      self._cluster = null

      cb(err)
    })
  }
}

/**
 * add configuration
 *
 * @method add
 * @memberof Cluster.prototype
 * @example
 * cluster.add({ config })
 * cluster.add({ config }, cb)
 * cluster.add('slave', { config })
 * cluster.add('slave', { config }, cb)
 *
 * @param {string} id target group name
 * @param {object} config configuration
 * @param {Cluster~callback} cb The callback that handle the results.
 * @see https://github.com/felixge/node-mysql/#connection-options
 */
Cluster.prototype.add = function (id, config, cb) {
  // param - config, cb
  if (typeof id === 'object') {
    cb = config
    config = id
  }
  cb = Cluster.cb(cb)

  if (this._load(cb) === false) {
    return false
  }

  if (this._driver === 'mysql') {
    // does not support async.
    this._cluster.add(id, config)
    cb(null)
  }
}

/**
 * remove configuration
 *
 * @method  remove
 * @memberof Cluster.prototype
 * @example
 * cluster.remove('slave')
 * cluster.remove('slave*')
 * cluster.remove('slave*', cb)
 * @param {string} id target group name
 * @param {Cluster~callback} cb The callback that handle the results.
 */
Cluster.prototype.remove = function (id, cb) {
  cb = Cluster.cb(cb)

  if (this._load(cb) === false) {
    return false
  }

  if (this._driver === 'mysql') {
    this._cluster.remove(id)
    cb(null)
  }
}

/**
 * load connection
 *
 * @method get
 * @memberof Cluster.prototype.
 * @example
 * cluster.get(cb); // Target Group : ALL, Selector : RR (round-robin:default)
 * cluster.get('master', cb);	 // Target Group : 'master', Selector : RR
 * @param {string} id target group name
 * @param {string} [selector] selector
 * @param {Cluster~getCallback} cb The callback that handle the results.
 */
Cluster.prototype.get = function (id, selector, cb) {
  if (this._load(cb) === false) {
    return false
  }

  if (this._driver === 'mysql') {
    this._cluster.getConnection(id, selector, cb)
  }
}

/**
 * close all connections
 * @method end
 * @memberof Cluster.prototype
 * @param {Cluster.prototype~callback} cb The callback that handle the results.
 */
Cluster.prototype.end = function (cb) {
  cb = Cluster.cb(cb)

  if (this._load(cb) === false) {
    return false
  }

  if (this._driver === 'mysql') {
    this._cluster.end(cb)
  }
}

/**
 * escape string
 * @method escape
 * @memberof Cluster.prototype
 * @param {string} str
 * @return {string}
 * @example
 * cluster.escape('value')
 * // 'value'
 */
Cluster.prototype.escape = function (str) {
  return mysql.escape(str)
}

/**
 * escape string by id
 * @method escapeId
 * @memberof Cluster.prototype
 * @param {string} str
 * @return {string}
 * @example
 * cluster.escapeId('table name')
 * // `table name`
 */
Cluster.prototype.escapeId = function (str) {
  return mysql.escapeId(str)
}

/**
 * prepare a query with mulitple insertion points,
 * @param {string} sql
 * @param {array} value
 * @return {string}
 * @example
 * var sql = "SELECT * FROM ?? WHERE ?? = ?"
var inserts = ['users', 'id', userId]
sql = cluster.format(sql, inserts)
 */
Cluster.prototype.format = function (sql, value) {
  return mysql.format(sql, value)
}

/**
 * if undefined then return empty function.
 * @memberof Cluster
 * @private
 */
Cluster.cb = function (cb) {
  if (typeof cb === 'undefined') {
    return function () {}
  }
  return cb
}

/**
 * @callback Cluster~loadCallack
 * @param  {object} err error object
 * @param  {string} res driver id
 */

/**
 * @callback Cluster~callback
 * @param  {object} err error object
 */

/**
 * @callback Cluster~getCallback
 * @param {object} err error object
 * @param {Connection} conn instance of connection.
 */

module.exports = new Cluster()
