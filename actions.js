var EventEmitter = require('events').EventEmitter,
    actions      = new EventEmitter(),
    exec         = require('child_process').exec,
    CONFIG       = {}

actions.on('SINGLE_CHANGE', function(path) {
  var parameters = [CONFIG['ACTIONS']['SINGLE_CHANGE'], path]
  var command = exec(parameters.join(' '))
  command.stdout.pipe(process.stdout)
})

actions.on('MULTIPLE_CHANGE', function(paths) {
  var parameters = [CONFIG['ACTIONS']['MULTIPLE_CHANGE']].concat(paths)
  var command = exec(parameters.join(' '))
  command.stdout.pipe(process.stdout)
})

module.exports = function(config) {
  CONFIG = config
  return actions
}
