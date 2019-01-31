// Generated by CoffeeScript 2.3.2
// # `nikita.system.move`

// Move files and directories. It is ok to overwrite the target file if it
// exists, in which case the source file will no longer exists.

// ## Options

// * `target`   
//   Final name of the moved resource.
// * `force`   
//   Force the replacement of the file without checksum verification, speed up
//   the action and disable the `moved` indicator in the callback.
// * `source`   
//   File or directory to move.
// * `target_md5`   
//   Destination md5 checkum if known, otherwise computed if target exists.
// * `source_md5`   
//   Source md5 checkum if known, otherwise computed.

// ## Callback parameters

// * `err`   
//   Error object if any.
// * `status`   
//   Value is "true" if resource was moved.

// ## Example

// ```js
// require('nikita')
// .system.move({
//   source: __dirname,
//   desination: '/tmp/my_dir'
// }, function(err, {status}){
//   console.log(err ? err.message : 'File moved: ' + status);
// });
// ```

// ## Source Code
module.exports = function({options}, callback) {
  var do_chkhash, do_dsthash, do_exists, do_move, do_remove_src, do_replace_dest, do_srchash, ssh;
  this.log({
    message: "Entering move",
    level: 'DEBUG',
    module: 'nikita/lib/system/move'
  });
  // SSH connection
  ssh = this.ssh(options.ssh);
  do_exists = () => {
    this.log({
      message: "Stat target",
      level: 'DEBUG',
      module: 'nikita/lib/system/move'
    });
    return this.fs.exists(options.target, function(err, {exists}) {
      if (err) {
        return callback(err);
      }
      if (!exists) {
        return do_move();
      }
      if (options.force) {
        return do_replace_dest();
      } else {
        return do_srchash();
      }
    });
  };
  do_srchash = () => {
    if (options.source_md5) {
      return do_dsthash();
    }
    this.log({
      message: "Get source md5",
      level: 'DEBUG',
      module: 'nikita/lib/system/move'
    });
    return this.file.hash(options.source, function(err, {hash}) {
      if (err) {
        return callback(err);
      }
      this.log({
        message: "Source md5 is \"hash\"",
        level: 'INFO',
        module: 'nikita/lib/system/move'
      });
      options.source_md5 = hash;
      return do_dsthash();
    });
  };
  do_dsthash = () => {
    if (options.target_md5) {
      return do_chkhash();
    }
    this.log({
      message: "Get target md5",
      level: 'DEBUG',
      module: 'nikita/lib/system/move'
    });
    return this.file.hash(options.target, (err, {hash}) => {
      if (err) {
        return callback(err);
      }
      this.log({
        message: "Destination md5 is \"hash\"",
        level: 'INFO',
        module: 'nikita/lib/system/move'
      });
      options.target_md5 = hash;
      return do_chkhash();
    });
  };
  do_chkhash = function() {
    if (options.source_md5 === options.target_md5) {
      return do_remove_src();
    } else {
      return do_replace_dest();
    }
  };
  do_replace_dest = () => {
    this.log({
      message: `Remove ${options.target}`,
      level: 'WARN',
      module: 'nikita/lib/system/move'
    });
    return this.system.remove({
      target: options.target
    }, function(err) {
      if (err) {
        return callback(err);
      }
      return do_move();
    });
  };
  do_move = () => {
    this.log({
      message: `Rename ${options.source} to ${options.target}`,
      level: 'WARN',
      module: 'nikita/lib/system/move'
    });
    return this.fs.rename({
      source: options.source,
      target: options.target
    }, function(err) {
      if (err) {
        return callback(err);
      }
      return callback(null, true);
    });
  };
  do_remove_src = () => {
    this.log({
      message: `Remove ${options.source}`,
      level: 'WARN',
      module: 'nikita/lib/system/move'
    });
    return this.system.remove({
      target: options.source
    }, function(err) {
      return callback(err);
    });
  };
  return do_exists();
};