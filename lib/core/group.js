// Generated by CoffeeScript 1.9.3
var uid_gid;

module.exports = function(options, callback) {
  var do_compare, do_create, do_info, do_modify, info, modified;
  if (!options.name) {
    return callback(new Error("Option 'name' is required"));
  }
  if (options.system == null) {
    options.system = false;
  }
  if (options.gid == null) {
    options.gid = null;
  }
  modified = false;
  info = null;
  do_info = function() {
    if (typeof options.log === "function") {
      options.log("Get group information for " + options.name);
    }
    options.store.cache_group = null;
    return uid_gid.group(options.ssh, options.store, function(err, groups) {
      if (err) {
        return callback(err);
      }
      if (typeof options.log === "function") {
        options.log("Got " + (JSON.stringify(groups[options.name])));
      }
      info = groups[options.name];
      if (info) {
        return do_compare();
      } else {
        return do_create();
      }
    });
  };
  do_create = (function(_this) {
    return function() {
      var cmd;
      cmd = 'groupadd';
      if (options.system) {
        cmd += " -r";
      }
      if (options.gid) {
        cmd += " -g " + options.gid;
      }
      cmd += " " + options.name;
      return _this.execute({
        cmd: cmd,
        code_skipped: 9
      }, function(err, created) {
        if (err) {
          return callback(err);
        }
        if (created) {
          modified = true;
        } else {
          if (typeof options.log === "function") {
            options.log("Group defined elsewhere than '/etc/group', exit code is 9");
          }
        }
        return callback(null, modified);
      });
    };
  })(this);
  do_compare = function() {
    var i, k, len, ref;
    ref = ['gid'];
    for (i = 0, len = ref.length; i < len; i++) {
      k = ref[i];
      if ((options[k] != null) && info[k] !== options[k]) {
        modified = true;
      }
    }
    if (typeof options.log === "function") {
      options.log("Did group information changed: " + modified);
    }
    if (modified) {
      return do_modify();
    } else {
      return callback();
    }
  };
  do_modify = (function(_this) {
    return function() {
      var cmd;
      cmd = 'groupmod';
      if (options.gid) {
        cmd += " -g " + options.gid;
      }
      cmd += " " + options.name;
      return _this.execute({
        ssh: options.ssh,
        cmd: cmd,
        log: options.log,
        stdout: options.stdout,
        stderr: options.stderr
      }, function(err) {
        return callback(err, modified);
      });
    };
  })(this);
  return do_info();
};

uid_gid = require('../misc/uid_gid');