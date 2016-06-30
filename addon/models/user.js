import DS from 'ember-data';

import GuidReferent from './guid-referent';

/**
 * Model for OSF APIv2 users. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 *    https://api.osf.io/v2/docs/#!/v2/User_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/User_Detail_GET
 *    https://api.osf.io/v2/docs/#!/v2/Institution_User_List_GET
 */
export default GuidReferent.extend({
    fullName: DS.attr('string'),
    givenName: DS.attr('string'),
    middleNames: DS.attr(),
    familyName: DS.attr('string'),

    dateRegistered: DS.attr('date'),

    nodes: DS.hasMany('nodes'),
    registrations: DS.hasMany('registrations'),

    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'users'
    })
});
