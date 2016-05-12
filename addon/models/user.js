import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';

export default OsfModel.extend({
    fullName: DS.attr('string'),
    givenName: DS.attr('string'),
    middleNames: DS.attr(),
    familyName: DS.attr('string'),

    dateRegistered: DS.attr('date'),

    nodes: DS.hasMany('nodes'),
    registrations: DS.hasMany('registrations'),

    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'children'
    })
});
