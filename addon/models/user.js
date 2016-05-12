import DS from 'ember-data';

import OsfModel from 'ember-osf/mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    given_name: DS.attr('string'),
    middle_names: DS.attr(),
    family_name: DS.attr('string'),

    nodes: DS.hasMany('nodes'),
    registrations: DS.hasMany('registrations'),

    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'children'
    })
});
