import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    givenName: DS.attr('string'),
    middleNames: DS.attr(),
    familyName: DS.attr('string'),
    fullName: DS.attr('string'),

    dateRegistered: DS.attr('date'),

    nodes: DS.hasMany('nodes'),
    registrations: DS.hasMany('registrations'),

    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'users'
    })
});
