import DS from 'ember-data';
import OsfModel from './osf-model';

export default OsfModel.extend({
    comment: DS.attr('string'),
    dateLastTransitioned: DS.attr('date'),
    created: DS.attr('date'),
    machineState: DS.attr('string'),
    modified: DS.attr('date'),
    requestType: DS.attr('string'),

    //Relationships
    target: DS.belongsTo('preprint', { inverse: null, async: true }),
    creator: DS.belongsTo('user', { inverse: null, async: true }),
});
