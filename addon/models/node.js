import DS from 'ember-data';

import OsfModel from './osf-model';
import FileItemMixin from 'ember-osf/mixins/file-item';

import { serializeHasMany } from '../utils/serialize-relationship';

/**
 * Model for OSF APIv2 nodes. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 *    https://api.osf.io/v2/docs/#!/v2/Node_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/Node_Detail_GET
 *    https://api.osf.io/v2/docs/#!/v2/Node_Children_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/Linked_Nodes_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/Node_Forks_List_GET
 *    https://api.osf.io/v2/docs/#!/v2/User_Nodes_GET
 */
export default OsfModel.extend(FileItemMixin, {
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
            serialized(serialized) {
                return {
                    data: serialized.map(function(record) {
                        var data = record.data;
                        return data;
                    })
                };
            }
        },
        inverse: null
    }),

    files: DS.hasMany('file-provider'),
    //forkedFrom: DS.belongsTo('node'),
    nodeLinks: DS.hasMany('node-links', {
        updateRequest: {
            requestType: () => 'POST',
            isBulk: () => true,
            serialized(serialized) {
                return {
                    data: serialized.map(function(record) {
                        var data = record.data;
                        return data;
                    })
                };
            }
        },
        inverse: null
    }),
    registrations: DS.hasMany('registrations', {
        inverse: 'registeredFrom'
    }),

    root: DS.belongsTo('node', {
        inverse: null
    }),
    logs: DS.hasMany('logs')
});
