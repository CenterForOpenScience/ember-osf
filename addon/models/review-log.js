import DS from 'ember-data';
import OsfModel from './osf-model';

export default OsfModel.extend({
    action: DS.attr('string'),
    comment: DS.attr('string'),
    fromState: DS.attr('string'),
    toState: DS.attr('string'),
    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),

    // Relationships
    provider: DS.belongsTo('preprint-provider', { inverse: null, async: true }),
    reviewable: DS.belongsTo('preprint', { inverse: 'reviewLogs', async: true }),
    creator: DS.belongsTo('user', { inverse: null, async: true }),
});
