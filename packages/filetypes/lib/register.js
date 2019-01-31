// Generated by CoffeeScript 2.3.2
var registry;

registry = require('@nikitajs/core/lib/registry');

registry.register({
  file: {
    types: {
      ceph_conf: '@nikitajs/filetypes/lib/ceph_conf',
      locale_gen: '@nikitajs/filetypes/lib/locale_gen',
      pacman_conf: '@nikitajs/filetypes/lib/pacman_conf',
      ssh_authorized_keys: '@nikitajs/filetypes/lib/ssh_authorized_keys',
      yum_repo: '@nikitajs/filetypes/lib/yum_repo'
    }
  }
});

registry.deprecate(['file', 'type', 'etc_group', 'read'], '@nikitajs/core/lib/system/group/read');

registry.deprecate(['file', 'type', 'etc_passwd', 'read'], '@nikitajs/core/lib/system/user/read');