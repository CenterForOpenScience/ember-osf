import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('user', {
    default: {
        fullName: FactoryGuy.generate(() => faker.name.findName()),
        givenName: FactoryGuy.generate(() => faker.name.firstName()),
        familyName: FactoryGuy.generate(() => faker.name.lastName()),

        dateRegistered: FactoryGuy.generate(() => faker.date.past(1))
    },
    traits: {
        // TODO: Consider writing tests that would force pagination of relationships (!)
        has_projects: {
            nodes: FactoryGuy.hasMany('node', 3)
        },
        has_registrations: {
            registrations: FactoryGuy.hasMany('registration', 3)
        },
        has_institutions: {
            affiliatedInstitutions: FactoryGuy.hasMany('registration', 2)
        }
    }
});
