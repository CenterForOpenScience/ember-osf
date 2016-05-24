import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('file', {
    default: {
        name: FactoryGuy.generate(() => faker.system.fileName()),
        kind: 'file',
        path: '/1234567890',  // Faker.system.filePath may not yet be implemented
        size: FactoryGuy.generate(() => faker.random.number()),
        provider: 'osfstorage',
        materialized_path: "/osf_test_file.jpg",
        lastTouched: null,

        dateModified: FactoryGuy.generate(() => faker.date.recent(1)),
        dateCreated: FactoryGuy.generate(() => faker.date.past(1)),

        isProvider: false,
        checkout: false,
    },
    traits: {
        // Folder specific
        hasFiles: { 
            kind: 'folder',
            files: FactoryGuy.generate(() => FactoryGuy.hasMany('file', 3))
        },
        // File specific
        hasVersions: {
            kind: 'file'
        },
        hasComments: {
            kind: 'file',
            comments: FactoryGuy.generate(() => FactoryGuy.hasMany('comment', 3))
        }
    }
});
