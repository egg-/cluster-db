var async = require('async')
var cluster = require('../index')
var database = require('./database.json')

var simpleQuery = function (sql, value, cb) {
  cluster.get('slave*', function (err, conn) {
    if (err) {
      return console.error(err)
    }

    conn.query(sql, value, function (err, rows) {
      conn.release()

      if (err) {
        console.log(sql, value)
        throw err
      }

      cb(err, rows)
    })
  })
}

// set event
cluster.on('remove', function (param) {
  console.info(param)
})

// load database
cluster.load('mysql', function (err) {
  if (err) {
    return console.error(err)
  }

  var tasks = []
  for (var i = 0; i < database.length; i++) {
    tasks.push(function (config) {
      return function (cb) {
        cluster.add(config.id, config, function (err) {
          if (err) {
            return cb(err)
          }

          cb(null, config.id)
        })
      }
    }(database[i]))
  }

  async.parallel(tasks, function (err, result) {
    if (err) {
      return console.error(err)
    }

    console.log('load cluster complete.', result)

    simpleQuery('SELECT * FROM users LIMIT 1', null, function (err, rows) {
      if (err) {
        return console.error(err)
      }

      console.log(rows)
    })
  })
})
