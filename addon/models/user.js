import Ember from 'ember';
import DS from 'ember-data';
import config from 'ember-get-config';

import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 users. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/User_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Institution_User_List_GET
 * @class User
 */
export default OsfModel.extend({
    currentUser: Ember.inject.service(),

    fullName: DS.attr('fixstring'),
    givenName: DS.attr('fixstring'),
    middleNames: DS.attr(),
    familyName: DS.attr('fixstring'),

    dateRegistered: DS.attr('date'),

    nodes: DS.hasMany('nodes'),
    registrations: DS.hasMany('registrations'),
    canViewReviews: DS.attr('boolean', {defaultValue: false}),

    quickfiles: DS.hasMany('files'),

    institutions: DS.hasMany('institutions', {
        inverse: 'users'
    }),
    emails: DS.hasMany('user-emails'),

    // Calculated fields
    profileURL: Ember.computed.alias('links.html'),
    profileImage: Ember.computed.alias('links.profile_image'),
    name: Ember.computed('fullname', 'giveName', 'familyName', function () {
        let fullName = this.get('fullName');
        let givenName = this.get('givenName');
        let familyName = this.get('familyName');
        if (givenName && familyName) {
            return `${givenName} ${familyName}`;
        } else {
            return fullName;
        }
    }),

    // custom model method to claim unregistered user
    claimUnregisteredUser(preprintId, email) {
        const userId = this.get('id');
        const url = `${config.OSF.apiUrl}/v2/users/${userId}/claim/`;
        const id = preprintId;
        const payload = {
            data: {
                attributes: {
                    email,
                    id,
                },
            },
        };
        return this.get('currentUser').authenticatedAJAX({
            url,
            crossDomain: true,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload),
        });
    },
});
