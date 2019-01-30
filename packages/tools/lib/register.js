// Generated by CoffeeScript 2.3.2
var registry;

registry = require('@nikitajs/core/lib/registry');

registry.register({
  tools: {
    backup: '@nikitajs/tools/lib/backup',
    compress: '@nikitajs/tools/lib/compress',
    extract: '@nikitajs/tools/lib/extract',
    rubygems: {
      'fetch': '@nikitajs/tools/lib/rubygems/fetch',
      'install': '@nikitajs/tools/lib/rubygems/install',
      'remove': '@nikitajs/tools/lib/rubygems/remove'
    },
    iptables: '@nikitajs/tools/lib/iptables',
    git: '@nikitajs/tools/lib/git',
    repo: '@nikitajs/tools/lib/repo',
    sysctl: '@nikitajs/tools/lib/sysctl'
  }
});
