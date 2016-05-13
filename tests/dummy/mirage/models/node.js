import {
    Model,
    belongsTo,
    hasMany
} from 'ember-cli-mirage';

export default Model.extend({
    parent: belongsTo('node'),
    children: hasMany('nodes', {
        inverseOf: 'parent'
    }),
    affiliatedInstitutions: hasMany('institutions', {
        inverseOf: 'nodes'
    }),
    contributors: hasMany('contributors'),

    // comments: hasMany('comments'),
    //files: DS.hasMany('files'),
    forkedFrom: belongsTo('node'),
    //nodeLinks:  DS.hasMany('node-pointers'),
    registrations: hasMany('registrations', {
        inverseOf: 'registeredFrom'
    }),

    root: belongsTo('node')
});
