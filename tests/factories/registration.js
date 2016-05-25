import FactoryGuy from 'ember-data-factory-guy';
import faker from 'faker';

FactoryGuy.define('registration', {
    default: {
        dateRegistered: FactoryGuy.generate(() => faker.date.past(1)),
        pendingRegistrationApproval: false,

        embargoEndDate: FactoryGuy.generate(() => faker.date.future(1)),
        pendingEmbargoApproval: false,

        withdrawn: false,
        pendingWithdrawal: false,

        // TODO: Implement with sample data for faker, possibly traits for different reg types
        registrationSupplement: null,
        registeredMeta: null,

        registeredFrom: FactoryGuy.generate(() => FactoryGuy.belongsTo('node')),
        registeredBy: FactoryGuy.generate(() => FactoryGuy.belongsTo('user')),

        contributors: FactoryGuy.generate(() => FactoryGuy.hasMany('contributor', 3)),
    },
    traits: {
        hasComments: {
            comments: FactoryGuy.generate(() => FactoryGuy.hasMany('comment', 3))
        }
    }
});
