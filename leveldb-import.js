var fs = require('fs')
var byteStream = require('byte-stream')
var csvParser = require('csv-parser')
var levelup = require('levelup')
var leveldown = require('leveldown')
var through = require('through2')

var db = levelup('./leveldb-import', { db: leveldown, createIfMissing: true })

var input = fs.createReadStream(process.argv[2])
var parser = csvParser({separator: '\t'})
var batcher = byteStream({time: 1000, limit: 128})
var writer = through.obj(function (batch, enc, next) {
  var ops = []
  for (var i = 0; i < batch.length; i++) {
    var obj = batch[i]
    ops.push({ type: 'put', key: obj.rsid, value: JSON.stringify(obj) })
  }
  db.batch(ops, next)
})

input.pipe(parser).pipe(batcher).pipe(writer)
