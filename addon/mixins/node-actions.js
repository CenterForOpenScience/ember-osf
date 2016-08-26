import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Controller mixin that implements common actions performed on nodes.
 * @class NodeActionsMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({
    /**
     * The node to perform these actions on. If not specified, defaults to the model hook.
     * @property node
     * @type DS.Model
     */
    node: null,
    model: null,
    _node: Ember.computed.or('node', 'model'),
    /**
     * Helper method that affiliates an institution with a node.
     *
     * @method _affiliateNode
     * @private
     * @param {DS.Model} node Node record
     * @param {Object} institution Institution record
     * @return {Promise} Returns a promise that resolves to the updated node with the newly created institution relationship
     */
    _affiliateNode(node, institution) {
        node.get('affiliatedInstitutions').pushObject(institution);
        return node.save();
    },
    actions: {
        /**
         * Update a node
         *
         * @method updateNode
         * @param {String} title New title of the node
         * @param {String} description New Description of the node
         * @param {String} category New node category
         * @param {Boolean} isPublic Should this node be publicly-visible?
         * @return {Promise} Returns a promise that resolves to the updated node
         */
        updateNode(title, description, category, isPublic) {
            var node = this.get('_node');
            if (title) {
                node.set('title', title);
            }
            if (category) {
                node.set('category', category);
            }
            if (description) {
                node.set('description', description);
            }
            if (isPublic !== null) {
                node.set('public', isPublic);
            }
            return node.save();
        },
        /**
         * Delete a node
         *
         * @method deleteNode
         * @return {Promise} Returns a promise that resolves after the deletion of the node.
         */
        deleteNode() {
            var node = this.get('_node');
            return node.destroyRecord();
        },
        /**
         * Affiliate a node with an institution
         *
         * @method affiliateNode
         * @param {String} institutionId ID of the institutution to be affiliated
         * @return {Promise} Returns a promise that resolves to the updated node
         * with the newly affiliated institution relationship
         */
        affiliateNode(institutionId) {
            var node = this.get('_node');
            return this.store.findRecord('institution', institutionId)
                .then(institution => this._affiliateNode(node, institution));
        },
        /**
         * Unaffiliate a node with an institution
         *
         * @method unaffiliateNode
         * @param {Object} institution Institution relationship to be removed from node
         * @return {Promise} Returns a promise that resolves to the updated node
         * with the affiliated institution relationship removed.
         */
        unaffiliateNode(institution) {
            var node = this.get('_node');
            node.get('affiliatedInstitutions').removeObject(institution);
            return node.save();
        },
        /**
         * Add a contributor to a node
         *
         * @method addContributor
         * @param {String} userId ID of user that will be a contributor on the node
         * @param {String} permission User permission level. One of "read", "write", or "admin". Default: "write".
         * @param {Boolean} isBibliographic Whether user will be included in citations for the node. "default: true"
         * @param {Boolean} sendEmail Whether user will receive an email when added. "default: true"
         * @return {Promise} Returns a promise that resolves to the newly created contributor object.
         */
        addContributor(userId, permission, isBibliographic, sendEmail) { // jshint ignore:line
            return this.get('_node').addContributor(...arguments);
        },
        /**
         * Remove a contributor from a node
         *
         * @method removeContributor
         * @param {Object} contributor Contributor relationship that will be removed from node
         * @return {Promise} Returns a promise that will resolve upon contributor deletion.
         * User itself will not be removed.
         */
        removeContributor(contributor) {
            var node = this.get('_node');
            return node.removeContributor(contributor);
        },
        /**
         * Update contributors of a node. Makes a bulk request to the APIv2.
         *
         * @method updateContributors
         * @param {Contributor[]} contributors Contributor relationships on the node.
         * @param {Object} permissionsChanges Dictionary mapping contributor ids to desired permissions.
         * @param {Object} bibliographicChanges Dictionary mapping contributor ids to desired bibliographic statuses
         * @return {Promise} Returns a promise that resolves to the updated node
         * with edited contributor relationships.
         */
        updateContributors(contributors, permissionsChanges, bibliographicChanges) {  // jshint ignore:line
            return this.get('_node').updateContributors(...arguments);
        },

        /**
         * Update contributors of a node. Makes a bulk request to the APIv2.
         *
         * @method updateContributor
         * @param {Contributor} contributor relationship on the node.
         * @param {string} permissions desired permissions.
         * @param {boolean} bibliographic desired bibliographic statuses
         * @return {Promise} Returns a promise that resolves to the updated node
         * with edited contributor relationships.
         */
        updateContributor(contributor, permissions, bibliographic) { // jshint ignore:line
            return this.get('_node').updateContributor(...arguments);
        },
        /**
         * Reorder contributors on a node
         *
         * @method reorderContributors
         * @param {Object} contributor Contributor record to be modified
         * @param {Integer} newIndex Contributor's new position in the list
         * @return {Promise} Returns a promise that resolves to the updated contributor.
         */
        reorderContributors(contributor, newIndex) {
            contributor.set('index', newIndex);
            return contributor.save();
        },
        /**
         * Add a child (component) to a node.
         *
         * @method addChild
         * @param {String} title Title for the child
         * @param {String} description Description for the child
         * @param {String} category Category for the child
         * @return {Promise} Returns a promise that resolves to the newly created child node.
         */
        addChild(title, description, category) {
            return this.get('_node').addChild(title, description, category);
        },
        /**
         * Add a node link (pointer) to another node
         *
         * @method addNodeLink
         * @param {String} targetNodeId ID of the node for which you wish to create a pointer
         * @return {Promise} Returns a promise that resolves to model for the newly created NodeLink
         */
        addNodeLink(targetNodeId) {
            var node = this.get('_node');
            var nodeLink = this.store.createRecord('node-link', {
                target: targetNodeId
            });
            node.get('nodeLinks').pushObject(nodeLink);
            return node.save().then(() => nodeLink);
        },
        /**
         * Remove a node link (pointer) to another node
         *
         * @method removeNodeLink
         * @param {Object} nodeLink nodeLink record to be destroyed.
         * @return {Promise} Returns a promise that resolves after the node link has been removed.  This does not delete
         * the target node itself.
         */
        removeNodeLink(nodeLink) {
            return nodeLink.destroyRecord();
        }
    }
});
