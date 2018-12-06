import Ember from 'ember';
import DS from 'ember-data';
import OsfModel from './osf-model';

import FileItemMixin from 'ember-osf/mixins/file-item';
import ContributorMixin from 'ember-osf/mixins/contributor-mixin';
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
export default OsfModel.extend(FileItemMixin, ContributorMixin, {
    isNode: true,

    title: DS.attr('fixstring'),
    description: DS.attr('fixstring'),
    category: DS.attr('fixstring'),

    // List of strings
    currentUserPermissions: DS.attr(),

    fork: DS.attr('boolean'),
    collection: DS.attr('boolean'),
    registration: DS.attr('boolean'),
    public: DS.attr('boolean'),

    dateCreated: DS.attr('date'),
    dateModified: DS.attr('date'),

    forkedDate: DS.attr('date'),

    nodeLicense: DS.attr(),
    tags: DS.attr(),

    templateFrom: DS.attr('fixstring'),

    parent: DS.belongsTo('node', {
        inverse: 'children'
    }),
    children: DS.hasMany('nodes', {
        inverse: 'parent'
    }),
    preprints: DS.hasMany('preprints', {
        inverse: 'node'
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
    citation: DS.belongsTo('citation'),

    license: DS.belongsTo('license', {
        inverse: null
    }),

    files: DS.hasMany('file-provider'),
    //forkedFrom: DS.belongsTo('node'),
    linkedNodes: DS.hasMany('nodes', {
        inverse: null,
        serializerType: 'linked-node'
    }),
    registrations: DS.hasMany('registrations', {
        inverse: 'registeredFrom'
    }),

    draftRegistrations: DS.hasMany('draft-registrations', {
        inverse: 'branchedFrom'
    }),

    forks: DS.hasMany('nodes', {
        inverse: 'forkedFrom'
    }),

    forkedFrom: DS.belongsTo('node', {
        inverse: 'forks'
    }),

    root: DS.belongsTo('node', {
        inverse: null
    }),

    wikis: DS.hasMany('wikis', {
        inverse: 'node'
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

    addChild(title, description=null, category='project', isPublic) {
        let child = this.store.createRecord('node', {
            title,
            category,
            description,
            parent: this,
            public: isPublic
        });

        return child.save();
    },
});
