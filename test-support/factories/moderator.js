import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('moderator', {
    default: {
        fullName: () => faker.name.findName(),
        permissionGroup: () => 'admin',
    },
});
