import {
    Factory,
    faker
} from 'ember-cli-mirage';

import NodeModel from 'ember-osf/models/node';
var CATEGORIES = Object.keys(NodeModel.CATEGORY_MAP);

import {
    pickOne
} from '../util';

import {
    PERMISSIONS
} from 'ember-osf/const/permissions';

export default Factory.extend({
    title: function() {
        return `${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.hacker.verb()} ${faker.hacker.noun()}`;
    },
    description: faker.hacker.phrase,
    category: pickOne(CATEGORIES),
    currentUserPermissions: pickOne(PERMISSIONS),

    fork: faker.random.boolean,
    collection: faker.random.boolean,
    registration: faker.random.boolean,
    public: faker.random.boolean,

    dateCreated: faker.date.past,
    dateModified: function() {
        return faker.date.between(this.dateCreated, new Date());
    },

    tags: function() {
        return [
            faker.company.catchPhraseNoun(),
            faker.company.catchPhraseNoun(),
            faker.company.catchPhraseNoun()
        ];
    }
});
