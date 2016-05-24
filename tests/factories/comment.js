import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('comment', {
    default: {
        content: faker.lorem.sentence(),

        dateCreated: FactoryGuy.generate(() => faker.date.past(1)),
        dateModified: FactoryGuy.generate(() => faker.date.recent(1)),

        modified: true,
        deleted: false,

        isAbuse: false,
        hasChildren: false,
        
        canEdit: true,
    },
    traits: {
        // List of possible "page" values h/t Saman- must be one of these values. Mutually exclusive.
        isWiki: {
            page: 'wiki'
        },
        isNode: {
            page: 'node'
        },
        isFile: {
            page: 'files'
        },
        // TODO: Add a hasReplies trait in the future to support replies- can we make reply page type match the specified parent type?
    }
});
