import {
    Model,
    hasMany
} from 'ember-cli-mirage';

export default Model.extend({
    nodes: hasMany('nodes'),
    registrations: hasMany('registrations'),
    affiliatedInstitutions: hasMany('institutions', {
        inverseOf: 'users'
    })
});
