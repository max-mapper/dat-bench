var test = require('tape')
var spawn = require('npm-execspawn')
var tapeSpawn = require('tape-spawn')
var through = require('through2')
var rimraf = require('rimraf')

function devNull() {
  return through(function (ch, enc, next) {
    next()
  })
}

test('cleanup', function (t) {
  rimraf.sync('./.dat')
  t.end()
})

test('parse genome csv', function (t) {
  console.time('parse csv')
  var proc = spawn("csv-parser --separator=$'\t' maxogden-genome.txt")
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('parse csv')
    t.end()
  })
})

test('dat init', function (t) {
  var proc = tapeSpawn(t, 'dat init')
  proc.end()
})

test('import genome csv', function (t) {
  console.time('import csv')
  var proc = spawn("dat import maxogden-genome.txt --separator=$'\t' --key=rsid -d genome")
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('import csv')
    t.end()
  })
})

test('export genome csv', function (t) {
  console.time('export csv')
  var proc = spawn("dat export -d genome -f csv")
  var out = devNull()
  proc.stdout.pipe(out)
  proc.stderr.pipe(out)
  proc.on('exit', function () {
    console.timeEnd('export csv')
    t.end()
  })
})
