import DS from 'ember-data';

import OsfModel from './osf-model';

import { serializeHasMany } from '../utils/serialize-relationship';

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
        inverse: 'parent',
        updateRequest: {
            requestType: () => 'POST'
        }
    }),
    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'nodes',
        serializer: serializeHasMany.bind(null, 'affiliatedInstitutions', 'institution')
    }),
    comments: DS.hasMany('comments'),
    contributors: DS.hasMany('contributors', {
        updateRequest: {
            requestType: (snapshot, relationship) => snapshot.hasMany(relationship).filter(each => Object.keys(each.changedAttributes()).indexOf('userId') !== -1).length > 0 ? 'POST' : 'PATCH',
            isBulk: () => true,
            serialized(serialized){
                return {
                    data: serialized.map(function(record) {
                        var data = record.data;
                        return data;
                })};
            }
        }
    }),

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
