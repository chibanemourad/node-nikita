
`krb5_principal([goptions], options, callback`
----------------------------------------------

Create a new Kerberos principal and an optionnal keytab.

    each = require 'each'
    misc = require './misc'
    conditions = require './misc/conditions'
    child = require './misc/child'
    execute = require './execute'
    krb5_ktadd = require './krb5_ktadd'

`options`           Command options include:
*   `kadmin_server` Address of the kadmin server; optional, use "kadmin.local" if missing.
*   `kadmin_principal`  KAdmin principal name unless `kadmin.local` is used.
*   `kadmin_password`   Password associated to the KAdmin principal.
*   `principal`     Principal to be created.
*   `password`      Password associated to this principal; required if no randkey is provided.
*   `randkey`       Generate a random key; required if no password is provided.
*   `keytab`        Path to the file storing key entries.
*   `ssh`           Run the action on a remote server using SSH, an ssh2 instance or an configuration object used to initialize the SSH connection.
*   `log`           Function called with a log related messages.
*   `stdout`        Writable Stream in which commands output will be piped.
*   `stderr`        Writable Stream in which commands error will be piped.

    module.exports = (goptions, options, callback) ->
      [goptions, options, callback] = misc.args arguments
      misc.options options, (err, options) ->
        return callback err if err
        executed = 0
        each(options)
        .parallel( goptions.parallel )
        .on 'item', (options, next) ->
          return next new Error 'Property principal is required' unless options.principal
          return next new Error 'Password or randkey missing' if not options.password and not options.randkey
          modified = false
          do_kadmin = ->
            # options.realm ?= options.principal.split('@')[1] # Break cross-realm principals
            options.realm ?= options.kadmin_principal.split('@')[1] if /.*@.*/.test options.kadmin_principal
            cmd = misc.kadmin options, if options.password
            then "addprinc -pw #{options.password} #{options.principal}"
            else "addprinc -randkey #{options.principal}"
            execute
              cmd: cmd
              ssh: options.ssh
              log: options.log
              stdout: options.stdout
              stderr: options.stderr
            , (err, _, stdout) ->
              return next err if err
              modified = true if -1 is stdout.indexOf 'already exists'
              do_keytab()
          do_keytab = ->
            krb5_ktadd options, (err, ktadded) ->
              modified = true if ktadded
              do_end()
          do_end = ->
            executed++ if modified
            next()
          conditions.all options, next, do_kadmin
        .on 'both', (err) ->
          callback err, executed