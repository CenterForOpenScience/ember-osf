import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    logoPath: DS.attr('string'),
    authUrl: DS.attr('string'),

    children: DS.hasMany('users', {
        inverse: 'affiliatedInstitutions'
    }),
    nodes: DS.hasMany('nodes', {
        inverse: 'affiliatedInstitutions'
    }),
    registrations: DS.hasMany('registrations', {
        inverse: 'affiliatedInstitutions'
    })

});
