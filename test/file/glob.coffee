
nikita = require '../../src'
they = require 'ssh2-they'
path = require 'path'

describe 'file.glob', ->

  they 'should traverse a directory', (ssh) ->
    nikita
      ssh: ssh
    .file.glob "#{__dirname}/../../lib/*", (err, {files}) ->
      throw err if err
      files.should.not.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
    .promise()

  they 'should traverse a directory recursively', (ssh) ->
    nikita
      ssh: ssh
    .file.glob "#{__dirname}/../../lib/**", (err, {files}) ->
      throw err if err
      files.should.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
    .promise()

  they 'should match an extension patern', (ssh) ->
    nikita
      ssh: ssh
    .file.glob "#{__dirname}/../../lib/*.js", (err, {files}) ->
      throw err if err
      files.should.not.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
    .promise()

  they 'should match an extension patern in recursion', (ssh) ->
    nikita
      ssh: ssh
    .file.glob "#{__dirname}/../../**/*.js", (err, {files}) ->
      throw err if err
      files.should.not.containEql path.normalize "#{__dirname}/../../lib"
      files.should.containEql path.normalize "#{__dirname}/../../lib/index.js"
      files.should.not.containEql path.normalize "#{__dirname}/../../lib/misc"
      files.should.containEql path.normalize "#{__dirname}/../../lib/misc/glob.js"
    .promise()

  they 'return an empty array on no match', (ssh) ->
    nikita
      ssh: ssh
    .file.glob "#{__dirname}/../doesnotexist/*.js", (err, {files}) ->
      throw err if err
      files.length.should.equal 0
    .promise()

  they 'include dot', (ssh) ->
    nikita
      ssh: ssh
    .file.glob "#{__dirname}/../../*", dot: 1, (err, {files}) ->
      throw err if err
      files.should.containEql path.normalize "#{__dirname}/../../.git"
      files.should.containEql path.normalize "#{__dirname}/../../.gitignore"
    .promise()
