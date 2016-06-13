import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('contributor', {
    default: {
        bibliographic: () => faker.random.boolean(),
        permission: () => faker.random.arrayElement(['read', 'write', 'admin']),
        userId: () => faker.lorem.words(1)
        // nodeID: // TODO: Field not defined in serializer. Find out meaning and add to factory.
    }
});
