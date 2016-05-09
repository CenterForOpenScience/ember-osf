import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    logo_path: DS.attr('string'),
    auth_url: DS.attr('string'),

    children: DS.hasMany('users', {
        inverse: 'affiliated_institutions'
    }),
    nodes: DS.hasMany('nodes', {
        inverse: 'affiliated_institutions'
    }),
    registrations: DS.hasMany('registrations', {
        inverse: 'affiliated_institutions'
    }),

});
