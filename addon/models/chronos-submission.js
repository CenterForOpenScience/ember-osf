import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 citation styles
 *
 * @class ChronosSubmissions
 */
export default OsfModel.extend({
    // attributes
    submissionUrl: DS.attr('string'),
    status: DS.attr('string'),

    //relationships
    submitter: DS.belongsTo('user', { inverse: null }),
    journal: DS.belongsTo('chronos-journal', { inverse: null }),
    preprint: DS.belongsTo('preprint', { inverse: null }),
});
