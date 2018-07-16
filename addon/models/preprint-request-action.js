import DS from 'ember-data';
import OsfModel from './osf-model';

export default OsfModel.extend({
    actionTrigger: DS.attr('string'),
    comment: DS.attr('string'),

    // Relationships
    target: DS.belongsTo('preprint-request', { inverse: null, async: true }),
});
