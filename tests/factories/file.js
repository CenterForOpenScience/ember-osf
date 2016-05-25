import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('file', {
    default: {
        name: () => faker.lorem.word() + '.txt',
        kind: 'file',
        path: '/1234567890',  // Faker.system.filePath may not yet be implemented
        size: () => faker.random.number(),
        provider: 'osfstorage',
        materializedPath: () => '/' + faker.lorem.word() + '.png',
        lastTouched: null,

        dateModified: () => faker.date.recent(1),
        dateCreated: () => faker.date.past(1),

        isProvider: false,
        checkout: false,
    },
    traits: {
        // Folder specific
        isFolder: {
            kind: 'folder',
            materializedPath: () => '/' + faker.lorem.word(),
            files: () => FactoryGuy.hasMany('file', 3)
        },
        // File specific
        hasVersions: {
            kind: 'file',
            versions: () => FactoryGuy.hasMany('file-version', 3)
        },
        hasComments: {
            kind: 'file',
            comments: () => FactoryGuy.hasMany('comment', 3)
        }
    }
});
