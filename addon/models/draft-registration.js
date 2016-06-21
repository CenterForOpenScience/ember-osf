import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * Model for OSF APIv2 draft registrations.
 * This model represents draft registration data - the initiator of the draft,
 * the registrationSchema for the draft, and the registrationMetadata field, which is an object
 * containing responses to the supplemental questions described in the
 * registrationSchema.  branchedFrom is the node the user wants to register, and
 * registrationSupplement is the id of the registrationSchema (used on draft registration creation.)
 * For information on how to interact with a node's draft registrations, see:
 *    https://api.osf.io/v2/docs/#!/v2/Node_Draft_Registrations_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/Node_Draft_Registration_Detail_GET
*/
export default OsfModel.extend({
    registrationSupplement: DS.attr('string'),
    registrationMetadata: DS.attr(),
    datetimeInitiated: DS.attr('date'),
    datetimeUpdated: DS.attr('date'),
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
