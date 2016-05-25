import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('file', {
    default: {
        name: FactoryGuy.generate(() => faker.lorem.word() + '.txt'),
        kind: 'file',
        path: '/1234567890',  // Faker.system.filePath may not yet be implemented
        size: FactoryGuy.generate(() => faker.random.number()),
        provider: 'osfstorage',
        materializedPath: FactoryGuy.generate(() => '/' + faker.lorem.word() + '.png'),
        lastTouched: null,

        dateModified: FactoryGuy.generate(() => faker.date.recent(1)),
        dateCreated: FactoryGuy.generate(() => faker.date.past(1)),

        isProvider: false,
        checkout: false,
    },
    traits: {
        // Folder specific
        isFolder: {
            kind: 'folder',
            materializedPath: FactoryGuy.generate(() => '/' + faker.lorem.word()),
            files: FactoryGuy.generate(() => FactoryGuy.hasMany('file', 3))
        },
        // File specific
        hasVersions: {
            kind: 'file',
            versions: FactoryGuy.generate(() => FactoryGuy.hasMany('file-version', 3))
        },
        hasComments: {
            kind: 'file',
            comments: FactoryGuy.generate(() => FactoryGuy.hasMany('comment', 3))
        }
    }
});
