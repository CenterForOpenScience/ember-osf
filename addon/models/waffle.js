import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 waffle objects.
 * @class Waffle
 */
export default OsfModel.extend({
    name: DS.attr('fixstring'),
    note: DS.attr('fixstring'),
    active: DS.attr('boolean'),
});
