import DS from 'ember-data';

import OsfModel from './osf-model';

import FileItemMixin from 'ember-osf/mixins/file-item';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 nodes. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * * https://api.osf.io/v2/docs/#!/v2/Node_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Detail_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Children_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Linked_Nodes_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/Node_Forks_List_GET
 * * https://api.osf.io/v2/docs/#!/v2/User_Nodes_GET
 * @class Node
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
        inverse: 'parent'
    }),
    affiliatedInstitutions: DS.hasMany('institutions', {
        inverse: 'nodes'
    }),
    comments: DS.hasMany('comments'),
    contributors: DS.hasMany('contributors', {
        allowBulkUpdate: true,
        allowBulkRemove: true,
        inverse: null
    }),

    files: DS.hasMany('file-provider'),
    //forkedFrom: DS.belongsTo('node'),
    nodeLinks: DS.hasMany('node-links', {
        inverse: null
    }),
    registrations: DS.hasMany('registrations', {
        inverse: 'registeredFrom'
    }),

    draftRegistrations: DS.hasMany('draft-registrations', {
        inverse: 'branchedFrom'
    }),

    root: DS.belongsTo('node', {
        inverse: null
    }),
    logs: DS.hasMany('logs'),

    save() {
        // Some duplicate logic from osf-model#save needed to support
        // contributor edits being saved through the node
        var promise = this._super(...arguments);
        var contributors = this.hasMany('contributors').hasManyRelationship;
        if (contributors.hasData && contributors.hasLoaded) {
            this.set(
                '_dirtyRelationships.contributors.update',
                contributors.members.list.filter(m => !m.record.get('isNew') && Object.keys(m.record.changedAttributes()).length > 0)
            );
            // Contributors are a 'real' delete, not just a de-reference
            this.set(
                '_dirtyRelationships.contributors.delete',
                this.get('_dirtyRelationships.contributors.remove')
            );
            this.set('_dirtyRelationships.contributors.remove', []);
        }
        return promise;
    }
});
