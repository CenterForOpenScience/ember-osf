import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('institution', {
    default: {
        name: FactoryGuy.generate(() => faker.lorem.words(3)),
        description: FactoryGuy.generate(() => faker.lorem.description(3)),
        logoPath: '/img.jpg',
        authUrl: FactoryGuy.generate(() => faker.internet.url())
    },
    traits: {
        // TODO: Add children relations, if that field turns out to be needed after all (henrique)
        hasNodes: {
            nodes: FactoryGuy.generate(() => FactoryGuy.hasMany('node', 3))
        },
        hasRegistrations: {
            registrations: FactoryGuy.generate(() => FactoryGuy.hasMany('registration', 3))
        }
    }
});
