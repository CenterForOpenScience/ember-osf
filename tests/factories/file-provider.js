import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('file-provider', {
    default: {
        name: 'osfstorage',
        kind: 'folder',
        path: '/',
        provider: 'osfstorage',
    },
    traits: {
        hasFiles: {
            files: () => FactoryGuy.hasMany('file', 3)
        }
    }
});
