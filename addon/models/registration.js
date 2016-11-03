import DS from 'ember-data';

import Node from './node';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 registrations. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Registration_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Registration_Children_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Registrations_GET
 *
 * @class Registration
 */
export default Node.extend({
    dateRegistered: DS.attr('date'),
    pendingRegistrationApproval: DS.attr('boolean'),
    embargoEndDate: DS.attr('date'),
    pendingEmbargoApproval: DS.attr('boolean'),
    withdrawn: DS.attr('boolean'),
    withdrawalJustification: DS.attr('string'),
    pendingWithdrawal: DS.attr('boolean'),

    registrationSupplement: DS.attr('string'),
    registeredMeta: DS.attr(),

    registeredFrom: DS.belongsTo('node', {
        inverse: 'registrations'
    }),
    registeredBy: DS.belongsTo('user', {
        inverse: null
    }),
    contributors: DS.hasMany('contributors'),
    comments: DS.hasMany('comments'),
    draftRegistration: DS.attr('string'),
    registrationChoice: DS.attr('string'),
    liftEmbargo: DS.attr()
    //more relationship
});
