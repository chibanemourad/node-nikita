
# `docker_run(options, callback)`

Run Docker Containers

## Options

*   `container` (string)
    Name of the docker container to run.
*   `image` (string)
    Name/ID of base image. MANDATORY
*   `machine` (string)
    Name of the docker-machine. MANDATORY if using docker-machine
*   `cmd` (string)
    Overwrite the default ENTRYPOINT of the image
    Equivalent to --entrypoint docker parameter
*   `hostname` (string)
    Hostname in the docker container
*   `port` ( 'int:int' | [] )
    port mapping
*   `volume` ( 'path:path' | ['] )
    path mapping
*   `device` ('path' | [] )
    Send host device(s) to container
*   `dns` (ip-address | [] )
    Set custom DNS server(s)
*   `dns_search` (ip-address | [] )
    Set custom DNS search domain(s)
*   `expose` ( int | string | [] )
    Export port(s)
*   `link` ( containerName | containerID | [] )
    Link to other container(s)
*   `label` (string | [] )
    Set meta data on a container
*   `label_file` (path)
    Read in a line delimited file of labels
*   `add_host` ('host:ip' | [] )
    Add a custom host-to-IP mapping (host:ip)
*   `cap_add` ( | [] )
    Add Linux Capabilities
*   `cap_drop` ( | [] )
    Drop Linux Capabilities
*   `blkio_weight` (int)
    Block IO (relative weight), between 10 and 1000
*   `cgroup_parent`
    Optional parent cgroup for the container
*   `cid_file` ( path )
    Write the container ID to the file
*   `cpuset_cpus` (string)
    CPUs in which to allow execution (ex: 0-3 0,1 ...)
*   `entrypoint` ()
    Overwrite the default ENTRYPOINT of the image
*   `ipc` ( )
    IPC namespace to use
*   `ulimit`  ( | [] )
    Ulimit options
*   `volumes_from` (containerName | containerID | [] )
    Mount volumes from the specified container(s)
*   `service` (boolean)
    if true, run container as a service. Else run as a command. true by default
*   `env` ('VAR=value' | [] )
    Environment variables for the container.
*   `env_file` ( path | [] )
    Read in a file of environment variables
*   `rm` (boolean)
    delete the container when it ends. By Default: true in cmd mode, false in service mode
*   `cwd` (path)
    working directory of container
*   `net` (string)
    Set the Network mode for the container
*   `pid` (string)
    PID namespace to use
*   `publish_all` (boolean)
    Publish all exposed ports to random ports
*   `code`   (int|array)
    Expected code(s) returned by the command, int or array of int, default to 0.
*   `code_skipped`
    Expected code(s) returned by the command if it has no effect, executed will
    not be incremented, int or array of int.
*   `log`
    Function called with a log related messages.
*   `ssh` (object|ssh2)
    Run the action on a remote server using SSH, an ssh2 instance or an
    configuration object used to initialize the SSH connection.
*   `stdout` (stream.Writable)
    Writable EventEmitter in which the standard output of executed commands will
    be piped.
*   `stderr` (stream.Writable)
    Writable EventEmitter in which the standard error output of executed command
    will be piped.

## Callback parameters

*   `err`
    Error object if any.
*   `executed`
    if command was executed
*   `stdout`
    Stdout value(s) unless `stdout` option is provided.
*   `stderr`
    Stderr value(s) unless `stderr` option is provided.

## Example

```javascript
mecano.docker({
  ssh: ssh
  container: 'myContainer'
  image: 'test-image'
  env: ["FOO=bar",]
  entrypoint: '/bin/true'
}, function(err, is_true, stdout, stderr){
  if(err){
    console.log(err.message);
  }else if(is_true){
    console.log('OK!');
  }else{
    console.log('Ooops!');
  }
})
```

## Source Code

    module.exports = (options, callback) ->
      # Validate parameters
      return callback Error 'Missing image' unless options.image?
      # rm is false by default only if options.service is true
      options.service ?= true
      options.rm ?= !options.service
      return callback Error 'Invalid parameter, rm cannot be true if service is true' if options.service and options.rm
      options.log? 'Should specify a container name if rm is false [WARN]' unless options.container? or options.rm
      # Construct exec command
      docker.get_provider options, (err,  provider) =>
        return callback err if err
        options.provider = provider
        cmd = docker.prepare_cmd provider, options.machine
        cmd += 'docker run'
        # Classic options
        for opt, flag of { container: '--name', hostname: '-h', cpu_shares: '-c',
        cgroup_parent: '--cgroup-parent', cid_file: '--cidfile', blkio_weight: '--blkio-weight',
        cpuset_cpus: '--cpuset-cpus', entrypoint: '--entrypoint', ipc: '--ipc',
        log_driver: '--log-driver', memory: '-m', mac_address: '--mac-address',
        memory_swap: '--memory-swap', net: '--net', pid: '--pid', cwd: '-w'}
          cmd += " #{flag} #{options[opt]}" if options[opt]?
        # Specific options: autodiscovery or transformation
        cmd += if options.service then ' -d' else ' -t'
        # Flag options
        for opt, flag of { rm: '--rm', publish_all: '-P', privileged: '--privileged', read_only: '--read-only' }
          cmd += " #{flag}" if options[opt]
        # Arrays Options
        for opt, flag of { port:'-p', volume: '-v', device: '--device', label: '-l',
        label_file: '--label-file', expose: '--expose', env: '-e', env_file: '--env-file',
        dns: '--dns', dns_search: '--dns-search', volumes_from: '--volumes-from',
        cap_add: '--cap-add', cap_drop: '--cap-drop', ulimit: '--ulimit', add_host: '--add-host' }
          if options[opt]?
            if typeof options[opt] is 'string' or typeof options[opt] is 'number'
              cmd += " #{flag} #{options[opt]}"
            else if Array.isArray options[opt]
              for p in options[opt]
                if typeof p in ['string', 'number']
                  cmd += " #{flag} #{p}" for p in options[opt]
                else callback Error "Invalid parameter, '#{opt}' array should only contains string or number"
            else callback Error "Invalid parameter, '#{opt}' should be string, number or array"
        cmd += " #{options.image}"
        cmd += " #{options.cmd}" if options.cmd
        # Construct other exec parameter
        # Construct other exec parameter
        opts = docker.get_options cmd, options
        @execute opts, (err, executed, stdout, stderr) -> callback err, executed, stdout, stderr

## Modules Dependencies

    docker = require './commons'
    util = require 'util'