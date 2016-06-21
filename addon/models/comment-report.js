import DS from 'ember-data';

import OsfModel from './osf-model';

/**
 * Model for OSF APIv2 comment reports. Primarily accessed via relationship fields.
 * For field and usage information, see:
 *    https://api.osf.io/v2/docs/#!/v2/Comment_Reports_List_GET
 */
export default OsfModel.extend({
    category: DS.attr('string'),
    text: DS.belongsTo('comment')
});
