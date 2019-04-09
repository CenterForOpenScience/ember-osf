import DS from 'ember-data';
import OsfModel from './osf-model';

export default OsfModel.extend({
    actionTrigger: DS.attr('string'),
    comment: DS.attr('string'),
    auto: DS.attr('boolean'),
    dateModified: DS.attr('date'),

    // Relationships
    target: DS.belongsTo('preprint-request', { inverse: 'actions', async: true }),
    creator: DS.belongsTo('user', { inverse: null, async: true }),
});
