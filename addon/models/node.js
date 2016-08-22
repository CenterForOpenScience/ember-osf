import Ember from 'ember';
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
    isNode: true,

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
        inverse: 'node'
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

    // These are only computeds because maintaining separate flag values on different classes would be a headache TODO: Improve.
    /**
     * Is this a project? Flag can be used to provide template-specific behavior for different resource types.
     * @property isProject
     * @type boolean
     */
    isProject: Ember.computed.equal('constructor.modelName', 'node'),
    /**
     * Is this a registration? Flag can be used to provide template-specific behavior for different resource types.
     * @property isRegistration
     * @type boolean
     */
    isRegistration: Ember.computed.equal('constructor.modelName', 'registration'),

    /**
     * Is this node being viewed through an anonymized, view-only link?
     * @property isAnonymous
     * @type boolean
     */
    isAnonymous: Ember.computed.bool('meta.anonymous'),

    /**
     * Determine whether the specified user ID is a contributor on this node
     * @method isContributor
     * @param {String} userId
     * @returns {boolean} Whether the specified user is a contributor on this node
     */
    isContributor(userId) {
        // Return true if there is at least one matching contributor for this user ID
        if (!userId) {
            return new Ember.RSVP.Promise((resolve) => resolve(false));
        }
        var contribId = `${this.get('id')}-${userId}`;
        return this.store.findRecord('contributor', contribId).then(() => true, () => false);
    },

    save() {
        // Some duplicate logic from osf-model#save needed to support
        // contributor edits being saved through the node
        // Note: order is important here so _dirtyRelationships gets set by the _super call
        var promise = this._super(...arguments);
        if (!this.get('_dirtyRelationships.contributors')) {
            this.set('_dirtyRelationships.contributors', {});
        }

        var contributors = this.hasMany('contributors').hasManyRelationship;
        this.set(
            '_dirtyRelationships.contributors.update',
            contributors.members.list.filter(m => !m.record.get('isNew') && Object.keys(m.record.changedAttributes()).length > 0)
        );
        // Need to included created contributors even in relationship
        // hasLoaded is false
        this.set(
            '_dirtyRelationships.contributors.create',
            contributors.members.list.filter(m => m.record.get('isNew'))
        );
        // Contributors are a 'real' delete, not just a de-reference
        this.set(
            '_dirtyRelationships.contributors.delete',
            this.get('_dirtyRelationships.contributors.remove') || []
        );
        this.set('_dirtyRelationships.contributors.remove', []);
        return promise;
    },

    addChild(title, description, category) {
        let child = this.store.createRecord('node', {
            title: title,
            category: category || 'project',
            description: description || null,
            parent: this
        });

        return child.save();
    },

    addContributor(userId, permission, isBibliographic, fullName, email, index = Number.MAX_SAFE_INTEGER) {
        let contrib = this.store.createRecord('contributor', {
            index: index,
            permission: permission,
            bibliographic: isBibliographic,
            nodeId: this.get('id'),
            userId: userId,
            fullName: fullName,
            email: email
        });

        return contrib.save();
    },

    removeContributor(contributor) {
        return contributor.destroyRecord();
    },

    updateContributor(contributor, permissions, bibliographic) {
        if (!Ember.isEmpty(permissions))
            contributor.set('permission', permissions);
        if (!Ember.isEmpty(bibliographic))
            contributor.set('bibliographic', bibliographic);
        return contributor.save();
    },

    updateContributors(contributors, permissionsChanges, bibliographicChanges) {
        let payload = contributors
            .filter(contrib => contrib.id in permissionsChanges || contrib.id in bibliographicChanges)
            .map(contrib => {
                if (contrib.id in permissionsChanges) {
                    contrib.set('permission', permissionsChanges[contrib.id]);
                }

                if (contrib.id in bibliographicChanges) {
                    contrib.set('bibliographic', bibliographicChanges[contrib.id]);
                }

                return contrib.serialize({
                    includeId: true,
                    includeUser: false
                }).data;
            });

        return this.store.adapterFor('contributor').ajax(this.get('links.relationships.contributors.links.related.href'), 'PATCH', {
            data: {
                data: payload
            },
            isBulk: true
        }).then(resp => {
            this.store.pushPayload(resp);
            return contributors;
        });
    }
});
