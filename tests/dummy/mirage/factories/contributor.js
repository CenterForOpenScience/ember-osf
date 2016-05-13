import {
    Factory,
    faker
} from 'ember-cli-mirage';

import {
    PERMISSIONS
} from 'ember-osf/const/permissions';

import {
    pickOne
} from '../util';

export default Factory.extend({
    bibliographic: faker.random.boolean,
    permission: pickOne(PERMISSIONS)
});
