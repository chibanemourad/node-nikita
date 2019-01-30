// Generated by CoffeeScript 2.3.2
// # `nikita.tools.repo`

// Setup packet manager repository. Only support yum for now.

// ## Options

// * `source` (string)   
//   The source file(s) containing the repository(ies)   
// * `local` (boolean)   
//   Treat the source as local instead of remote, only apply with "ssh"
//   option.   
// * `content`   
//   Content to write inside the file. can not be used with source.   
// * `clean` (string)   
//   Globing expression used to match replaced files, path will resolve to
//   '/etc/yum.repos.d' if relative.   
// * `gpg_dir` (string)   
//   Directory storing GPG keys.   
// * `target` (string)   
//   Path of the repository definition file, relative to '/etc/yum.repos.d'.
// * `update` (boolean)   
//   Run yum update enabling only the ids present in repo file. Default to false.   
// * `verify`   
//   Download the PGP keys if it's enabled in the repo file, keys are by default
//   placed inside "/etc/pki/rpm-gpg" defined by the gpg_dir option and the 
//   filename is derivated from the url.   

// ## Example

// ```js
// require('nikita')
// .tools.repo({
//   source: '/tmp/centos.repo',
//   clean: 'CentOs*'
// }, function(err, {status}){
//   console.info(err ? err.message : 'Repo updated: ' + status);
// });
// ```

// ## Source Code
var misc, path, string, url;

module.exports = function({options}) {
  var keys, remote_files, repoids, ssh;
  this.log({
    message: "Entering tools.repo",
    level: 'DEBUG',
    module: 'nikita/lib/tools/repo'
  });
  // SSH connection
  ssh = this.ssh(options.ssh);
  if (options.source && options.content) {
    // Options
    throw Error("Can not specify source and content");
  }
  if (!(options.source || options.content)) {
    throw Error("Missing source or content: ");
  }
  if (options.source != null) {
    // TODO wdavidw 180115, target should be mandatory and not default to the source filename
    if (options.target == null) {
      options.target = path.resolve("/etc/yum.repos.d", path.basename(options.source));
    }
  }
  if (options.target == null) {
    throw Error("Missing target");
  }
  options.target = path.posix.resolve('/etc/yum.repos.d', options.target);
  if (options.verify == null) {
    options.verify = true;
  }
  if (options.clean && typeof options.clean !== 'string') {
    throw Error("Invalid Option: option 'clean' must be a 'string'");
  }
  if (options.clean) {
    options.clean = path.resolve('/etc/yum.repos.d', options.clean);
  }
  if (options.update == null) {
    options.update = false;
  }
  if (options.gpg_dir == null) {
    options.gpg_dir = '/etc/pki/rpm-gpg';
  }
  remote_files = [];
  repoids = [];
  // Delete
  this.call({
    if: options.clean
  }, function(_, callback) {
    this.log({
      message: "Searching repositories inside \"/etc/yum.repos.d/\"",
      level: 'DEBUG',
      module: 'nikita/lib/tools/repo'
    });
    return this.file.glob(options.clean, function(err, {files}) {
      var file;
      if (err) {
        return callback(err);
      }
      remote_files = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = files.length; i < len; i++) {
          file = files[i];
          if (file === options.target) {
            continue;
          }
          results.push(file);
        }
        return results;
      })();
      return callback();
    });
  });
  this.call(function() {
    return this.system.remove(remote_files);
  });
  // Download source
  this.file.download({
    if: options.source != null,
    source: options.source,
    target: options.target,
    headers: options.headers,
    md5: options.md5,
    proxy: options.proxy,
    location: options.location,
    cache: false
  });
  // Write
  this.filetypes.yum_repo({
    if: options.content != null,
    content: options.content,
    mode: options.mode,
    uid: options.uid,
    gid: options.gid,
    target: options.target
  });
  // Parse the definition file
  keys = [];
  this.log(`Read GPG keys from ${options.target}`, {
    level: 'DEBUG',
    module: 'nikita/lib/tools/repo'
  });
  this.fs.readFile({
    ssh: options.ssh,
    target: options.target,
    encoding: 'utf8'
  }, (err, {data}) => {
    var name, section;
    if (err) {
      throw err;
    }
    data = misc.ini.parse_multi_brackets(data);
    return keys = (function() {
      var results;
      results = [];
      for (name in data) {
        section = data[name];
        repoids.push(name);
        if (section.gpgcheck !== '1') {
          continue;
        }
        if (section.gpgkey == null) {
          throw Error('Missing gpgkey');
        }
        if (!/^http(s)??:\/\//.test(section.gpgkey)) {
          continue;
        }
        results.push(section.gpgkey);
      }
      return results;
    })();
  });
  // Download GPG Keys
  this.call({
    if: options.verify
  }, function() {
    var i, key, len, results;
    results = [];
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      this.log(`Downloading GPG keys from ${key}`, {
        level: 'DEBUG',
        module: 'nikita/lib/tools/repo'
      });
      this.file.download({
        source: key,
        target: `${options.gpg_dir}/${path.basename(key)}`
      });
      results.push(this.system.execute({
        if: function() {
          return this.status(-1);
        },
        cmd: `rpm --import ${options.gpg_dir}/${path.basename(key)}`
      }));
    }
    return results;
  });
  // Clean Metadata
  this.system.execute({
    if: function() {
      return path.relative('/etc/yum.repos.d', options.target) !== '..' && this.status();
    },
    // wdavidw: 180114, was "yum clean metadata", ensure an appropriate
    // explanation is provided in case of revert.
    // expire-cache is much faster,  It forces yum to go redownload the small
    // repo files only, then if there's newer repo data, it will downloaded it.
    cmd: 'yum clean expire-cache; yum repolist -y'
  });
  return this.call({
    if: function() {
      return options.update && this.status();
    }
  }, function() {
    return this.system.execute({
      cmd: `yum update -y --disablerepo=* --enablerepo='${repoids.join(',')}'\nyum repolist`,
      trap: true
    });
  });
};

// ## Dependencies
path = require('path');

misc = require('@nikitajs/core/lib/misc');

string = require('@nikitajs/core/lib/misc/string');

url = require('url');
