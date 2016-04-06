import DS from 'ember-data';

export default DS.Model.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    category: DS.attr('string'),

    currentUserPermissions: DS.attr(''),

    fork: DS.attr('boolean'),
    collection: DS.attr('boolean'),
    registration: DS.attr('boolean'),
    public: DS.attr('boolean'),

    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),

    tags: DS.attr(),

    templateFrom: DS.attr('string'),

    // TODO?
    // links = LinksField({'html': 'get_absolute_html_url'})

    parent: DS.belongsTo('node', {
        inverse: 'children'
    }),
    children: DS.hasMany('nodes', {
        inverse: 'parent'
    }),
    //comments: DS.hasMany('comments'),
    //contributors: DS.hasMany('node-contributors')
    //files: DS.hasMany('files'),
    //forkedFrom: DS.belongsTo('node'),
    //nodeLinks:  DS.hasMany('node-pointers'),
    //registrations: DS.hasMany('registrations'),
    //primaryInistution: DS.belongsTo('institution'),
    root: DS.belongsTo('node')
    //logs: DS.hasMany('node-logs'),
});
