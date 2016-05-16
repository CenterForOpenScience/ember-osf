import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from 'ember-osf/models/base';
function hasMany(ret, model){
    ret.set = function(){
        var val = ret.set(...arguments);
        model.set('relationshipIsDirty', true);
        return val;
    }
    return ret
}
function attr(ret, model){
    var func = ret.set
    ret.set = function(){

        var val = func.apply(ret, arguments);
        debugger;
        return val;
    }
    return ret
}
export default OsfModel.extend({
    title: DS.attr('string'),
    description: DS.attr('string'),
    category: DS.attr('string'),

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
    //affiliatedInstitutions: DS.attr(),
    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'nodes',
        simpleRelationship: true
    }),
    comments: DS.hasMany('comments'),
    contributors: DS.hasMany('contributors'),

    //files: DS.hasMany('files'),
    //forkedFrom: DS.belongsTo('node'),
    //nodeLinks:  DS.hasMany('node-pointers'),

    registrations: DS.hasMany('registrations', {
       inverse: 'registeredFrom'
    }),

    root: DS.belongsTo('node'),
    //logs: DS.hasMany('node-logs'),

    relationshipDirty: DS.attr('boolean'),
    // relationshipDirty: Ember.observer('affiliatedInstitutions', function(model, field){
    //     var newValue = this.get(field)
    //     var oldValue = this.get('_' + field)
    //     if (newValue === oldValue){
    //         return;
    //     }
    //     this.set('relationDirty', field)
    //     this.set('_'+field, newValue)
    // }),
    // relationshipSet: Ember.on('init', Ember.observer('affiliatedInstitutions', function(model, field) {
    //     var newValue = this.get(field)
    //     var oldValue = this.get('_' + field)
    //     if (newValue === oldValue){
    //         return;
    //     }
    //     this.set('_'+field, newValue)
    // }))
    onReady: Ember.on('ready', function() {
        var affiliated = this.affiliatedInstitutions;
        this.affiliatedInstitutions = hasMany(affiliated, this);
        var fork = this.fork;
        this.fork = attr(fork, this);
    })

});
