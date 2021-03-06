// Generated by CoffeeScript 2.4.1
// # `nikita.connection.assert`

// Assert a TCP or HTTP server is listening. 

// ## Options

// * `host` (string)  
//   Host of the targeted server, could be a FQDN, a hostname or an IP.
// * `port` (number)  
//   Port of the targeted server.
// * `server`, `servers` (array|object|string)  
//   One or multiple servers, string must be in the form of "{host}:{port}",
//   object must have the properties "host" and "port".

// ## Source code
module.exports = {
  shy: true,
  handler: function({options}) {
    var i, len, ref, results, server;
    this.log({
      message: "Entering connection.assert",
      level: 'DEBUG',
      module: 'nikita/lib/connection/assert'
    });
    if (options.servers == null) {
      options.servers = [];
    }
    if (options.server) {
      options.servers.push(options.server);
    }
    if (options.port && !options.host) {
      throw Error("Required Option: host is required if port is provided");
    }
    if (options.host && !options.port) {
      throw Error("Required Option: port is required if host is provided");
    }
    if (options.host) {
      options.servers.push({
        host: options.host,
        port: options.port
      });
    }
    ref = options.servers;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      server = ref[i];
      results.push(this.system.execute({
        cmd: `bash -c 'echo > /dev/tcp/${server.host}/${server.port}'`
      }, function(err) {
        if (err) {
          throw Error(`Address not listening: "${server.host}:${server.port}"`);
        }
      }));
    }
    return results;
  }
};
