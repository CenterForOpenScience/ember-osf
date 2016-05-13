import {
    faker
} from 'ember-cli-mirage';

import NodeFactory from './node';

export default NodeFactory.extend({
    dateRegistered: faker.date.past,
    embargoEndDate: faker.date.future,

    pendingRegistrationApproval: faker.random.boolean,
    pendingEmbargoApproval: function() {
        if (this.pendingRegistrationApproval) {
            return false;
        }
        return faker.random.boolean();
    },

    withdrawn: function() {
        if (this.pendignRegistrationApproval || this.pendingEmbargoApproval) {
            return false;
        }
        return faker.random.boolean();
    },
    withdrawalJustification: function() {
        if (this.withdrawn) {
            return faker.hacker.phrase();
        }
        return null;
    },
    pendingWithdrawal: function() {
        if (!(this.pendignRegistrationApproval || this.pendingEmbargoApproval) && !this.withdrawn) {
            return faker.random.boolean();
        }
        return false;
    },

    registrationSupplement: function() {
        return `${faker.hacker.adjective()} Preregistration (${faker.name.lastName} et al., ${faker.date.past().getFullYear()}`;
    },
    registeredMeta: function() {
        // TODO
        return {};
    }
});
