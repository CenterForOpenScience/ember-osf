import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('citation-style', {
    default: {
        title: () => faker.lorem.word(),
        shortTitle: () => faker.lorem.words(3),
        summary: () => faker.lorem.words(10),
        created: () => faker.date.past(1),
        modified: () => faker.date.recent(1),
        dateParsed: () => faker.date.recent(1),
        hasBibliography: () => faker.random.boolean(),
        nodeCitation: () => faker.lorem.words(10)
    }
});
