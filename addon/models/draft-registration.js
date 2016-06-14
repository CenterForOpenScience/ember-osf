import DS from 'ember-data';
import OsfModel from './osf-model';

export default OsfModel.extend({
    registrationSupplement: DS.attr('string'),
    registrationMetadata: DS.attr(),
    datetimeInitiated: DS.attr('date'),
    datetimeUpdated: DS.attr('date'),
    requiresApproval: DS.attr('boolean'),
    branchedFrom: DS.belongsTo('node', {
        inverse: null
    }),
    initiator: DS.belongsTo('user', {
        inverse: null
    }),
    registrationSchema: DS.belongsTo('metaschema', {
        inverse: null
    })
});
