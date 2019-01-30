// Generated by CoffeeScript 2.3.2
// # `nikita.docker.start`

// Start stopped containers or restart (stop + starts) a started container.

// ## Options

// * `boot2docker` (boolean)   
//   Whether to use boot2docker or not, default to false.   
// * `container` (string)   
//   Name/ID of the container, required.   
// * `machine` (string)   
//   Name of the docker-machine, required if using docker-machine   
// * `timeout` (int)   
//   Seconds to wait for stop before killing it   
// * `code` (int|array)   
//   Expected code(s) returned by the command, int or array of int, default to 0.   
// * `code_skipped`   
//   Expected code(s) returned by the command if it has no effect, executed will   
//   not be incremented, int or array of int.   

// ## Callback parameters

// * `err`   
//   Error object if any.   
// * `status`   
//   True if container was restarted.  

// ## Example

// ```javascript
// require('nikita')
// .docker.restart({
//   container: 'toto'
// }, function(err, {status}){
//   console.log( err ? err.message : 'Container restarted: ' + status);
// })
// ```

// ## Source Code
var docker, util;

module.exports = function({options}, callback) {
  var cmd, k, ref, v;
  this.log({
    message: "Entering Docker restart",
    level: 'DEBUG',
    module: 'nikita/lib/docker/restart'
  });
  // Global options
  if (options.docker == null) {
    options.docker = {};
  }
  ref = options.docker;
  for (k in ref) {
    v = ref[k];
    if (options[k] == null) {
      options[k] = v;
    }
  }
  if (options.container == null) {
    // Validate parameters
    return callback(Error('Missing container parameter'));
  }
  cmd = 'restart';
  if (options.timeout != null) {
    cmd += ` -t ${options.timeout}`;
  }
  cmd += ` ${options.container}`;
  return this.system.execute({
    cmd: docker.wrap(options, cmd)
  }, docker.callback);
};

// ## Modules Dependencies
docker = require('@nikitajs/core/lib/misc/docker');

util = require('util');
