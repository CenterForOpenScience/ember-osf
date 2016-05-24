import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('comment-report', {
    default: {
        category: FactoryGuy.generate(() => faker.random.arrayElement(['hate', 'spam', 'violence']))
    },
});
