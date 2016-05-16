import DS from 'ember-data';

import OsfModel from '../mixins/osf-model';

export default DS.Model.extend(OsfModel, {
    title: DS.attr('string'),
    description: DS.attr('string'),
    category: DS.attr('string'),
    parentId: DS.attr('string'),

    currentUserPermissions: DS.attr('string'),

    fork: DS.attr('boolean'),
    collection: DS.attr('boolean'),
    registration: DS.attr('boolean'),
    public: DS.attr('boolean'),

    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),

    tags: DS.attr(),

    templateFrom: DS.attr('string'),

    parent: DS.belongsTo('node', {
        inverse: 'children'
    }),
    children: DS.hasMany('nodes', {
        inverse: 'parent'
    }),
    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'nodes'
    }),
    comments: DS.hasMany('comments'),
    contributors: DS.hasMany('contributors'),

    files: DS.hasMany('file-provider'),
    //forkedFrom: DS.belongsTo('node'),
    //nodeLinks:  DS.hasMany('node-pointers'),
    registrations: DS.hasMany('registrations', {
        inverse: 'registeredFrom'
    }),

    root: DS.belongsTo('node', {
        inverse: null
    }),
    logs: DS.hasMany('logs')
});
