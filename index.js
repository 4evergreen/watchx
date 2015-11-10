#!/usr/bin/env node

var chokidar     = require('chokidar'),
    debounce     = require('lodash').debounce,
    fs           = require('fs'),
    path         = require('path')

var configFile = process.argv[2] || 'watchx.json'
var CONFIG = JSON.parse(fs.readFileSync(configFile, 'utf-8'))
var actions = require('./actions')(CONFIG)

var watchedDir = path.resolve(CONFIG['DIR'])

var watcher  = chokidar.watch(watchedDir, {
    ignored: CONFIG['IGNORE'],
    ignoreInitial: true,
    cwd: watchedDir
})

var eventsCounter = 0,
    changedFiles = []

var triggerAction = debounce(function() {
  var action = (eventsCounter == 1)
    ? 'SINGLE_CHANGE'
    : 'MULTIPLE_CHANGE'

  if (action == 'SINGLE_CHANGE') changedFiles = changedFiles[0]

  actions.emit(action, changedFiles)

  eventsCounter = 0
  changedFiles = []
}, CONFIG['DEBOUNCE'])

watcher
  .on('change', function(path) {
    eventsCounter++
    changedFiles.push(path)

    triggerAction()
  })
