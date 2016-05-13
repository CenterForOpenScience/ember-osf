import {
    Model,
    hasMany
} from 'ember-cli-mirage';

export default Model.extend({
    users: hasMany('users', {
        inverseOf: 'affiliatedInstitutions'
    }),
    nodes: hasMany('nodes', {
        inverseOf: 'affiliatedInstitutions'
    }),
    registrations: hasMany('registrations', {
        inverseOf: 'affiliatedInstitutions'
    })
});
