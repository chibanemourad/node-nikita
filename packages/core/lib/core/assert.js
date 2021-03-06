// Generated by CoffeeScript 2.4.1
// # `nikita.assert`

// A set of assertion tools.

// ## Options

// * `status` (boolean)   
//   Ensure the current status match the provided value.   

// ## Callback Parameters

// * `err`   
//   Error object if assertion failed.   

// ## Source Code
module.exports = function({options}) {
  var status;
  this.log({
    message: "Entering assert",
    level: 'DEBUG',
    module: 'nikita/lib/assert'
  });
  // ## Check current status

  // ```js
  // nikita.assert({
  //   ssh: connection   
  //   status: true
  // }, function(err){
  //   console.log(err ? err.message : 'Assertion is ok');
  // });
  // ```
  status = this.status();
  return this.call({
    if: (options.status != null) && status !== options.status
  }, function() {
    var message;
    message = `Invalid status: expected ${JSON.stringify(options.status)}, got ${JSON.stringify(status)}`;
    throw Error(message);
  });
};
