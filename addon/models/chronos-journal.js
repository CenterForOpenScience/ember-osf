import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 citation styles
 *
 * @class ChronosJournals
 */
export default OsfModel.extend({
    name: DS.attr('string'),
    title: DS.attr('string'),
});
