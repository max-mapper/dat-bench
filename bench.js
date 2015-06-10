var test = require('tape')
var spawn = require('npm-execspawn')
var tapeSpawn = require('tape-spawn')
var through = require('through2')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

function devNull() {
  return through(function (ch, enc, next) {
    next()
  })
}

test('cleanup', function (t) {
  rimraf.sync('./tmp')
  mkdirp.sync('./tmp/leveldb-import')
  t.end()
})

test('parse genome csv', function (t) {
  console.time('parse csv')
  var proc = spawn("csv-parser --separator=$'\t' ../maxogden-genome.txt", {cwd: './tmp'})
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('parse csv')
    t.end()
  })
})

test('leveldb import csv', function (t) {
  console.time('leveldb import csv')
  var proc = spawn("node ../leveldb-import.js ../maxogden-genome.txt", {cwd: './tmp'})
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('leveldb import csv')
    t.end()
  })
})


test('leveldb export json', function (t) {
  console.time('leveldb export json')
  var proc = spawn("superlevel ./leveldb-import createReadStream", {cwd: './tmp'})
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('leveldb export json')
    t.end()
  })
})

test('dat init', function (t) {
  var proc = tapeSpawn(t, 'dat init', {cwd: './tmp'})
  proc.end()
})

test('dat import csv', function (t) {
  console.time('dat import csv')
  var proc = spawn("dat import ../maxogden-genome.txt --separator=$'\t' --key=rsid -d genome", {cwd: './tmp'})
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('dat import csv')
    t.end()
  })
})

test('dat export json', function (t) {
  console.time('dat export json')
  var proc = spawn("dat export -d genome", {cwd: './tmp'})
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('dat export json')
    t.end()
  })
})
