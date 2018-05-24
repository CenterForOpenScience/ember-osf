import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 subscriptions.
 * @class Subscription
 */
export default OsfModel.extend({
    eventName: DS.attr('string'),
    frequency: DS.attr('string'),
});
