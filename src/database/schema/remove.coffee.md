
# `mecano.database.schema.remove`

Create a user for the destination database.

## Options

*   `admin_username`   
    The login of the database administrator. It should have credentials to 
    create accounts.   
*   `admin_password`   
    The password of the database administrator.   
*   `engine`   
    The engine type, can be MySQL or PostgreSQL, default to MySQL.   
*   `host`   
    The hostname of the database.   
*   `schema`   
    New schema name.

## Source Code

    module.exports = (options) ->
      # Import options from `options.db`
      options.db ?= {}
      options[k] ?= v for k, v of options.db
      options.schema ?= options.argument
      @execute
        cmd: db.cmd options, "DROP SCHEMA IF EXISTS #{options.schema};"

## Dependencies

    db = require '../../misc/db'
        