
registry = require '@nikitajs/core/lib/registry'

registry.register
  tools:
    backup: '@nikitajs/tools/src/backup'
    compress: '@nikitajs/tools/src/compress'
    extract: '@nikitajs/tools/src/extract'
    dconf: '@nikitajs/tools/lib/dconf'
    rubygems:
      'fetch': '@nikitajs/tools/src/rubygems/fetch'
      'install': '@nikitajs/tools/src/rubygems/install'
      'remove': '@nikitajs/tools/src/rubygems/remove'
    iptables: '@nikitajs/tools/src/iptables'
    git: '@nikitajs/tools/src/git'
    repo: '@nikitajs/tools/src/repo'
    ssh:
      keygen: '@nikitajs/tools/src/ssh/keygen'
    sysctl: '@nikitajs/tools/src/sysctl'
