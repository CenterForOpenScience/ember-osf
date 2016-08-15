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
     * Helper method that maps all node contributors to format {contribId: Contributor}
     *
     * @method _generateContributorMap
     * @private
     * @param {Contributor[]} contributors A list of contributors to be included in the map
     * @return {Object} Returns a contributor map of the id to the contributor record
     */
    _generateContributorMap(contributors) {
        var contribMap = {};
        contributors.forEach(contrib => contribMap[contrib.id] = contrib);
        return contribMap;
    },
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
         * @return {Promise} Returns a promise that resolves to the newly created contributor object.
         */
        addContributor(userId, permission, isBibliographic) {
            var node = this.get('_node');
            var contributor = this.store.createRecord('contributor', {
                id: `${node.get('id')}-${userId}`,
                permission: permission,
                bibliographic: isBibliographic
            });
            node.get('contributors').pushObject(contributor);
            return node.save().then(() => contributor);
        },
        /**
         * Add unregistered contributor to a node.  Creates a user and then adds that user as a contributor.
         *
         * @method addUnregisteredContributor
         * @param {String} fullName Full name of user
         * @param {String} email User's email
         * @return {Promise} Returns a promise that resolves to the created contributor
         */
        addUnregisteredContributor(fullName, email, permission, isBibliographic) {
            var user = this.store.createRecord('user', {
                fullName: fullName,
                username: email
            });
            // After user has been saved, add user as a contributor
            return user.save().then(user => {
                var node = this.get('_node');
                var contributor = this.store.createRecord('contributor', {
                    id: `${node.get('id')}-${user.id}`,
                    permission: permission,
                    bibliographic: isBibliographic
                });
                node.get('contributors').pushObject(contributor);
                return node.save().then(() => contributor);
            });
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
            contributor.setProperties({
                nodeId: node.id
            });
            return contributor.destroyRecord();
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
        updateContributors(contributors, permissionsChanges, bibliographicChanges) {
            var node = this.get('_node');
            var contributorMap = this._generateContributorMap(contributors);
            for (let contributorId in permissionsChanges) {
                contributorMap[contributorId].set('permission', permissionsChanges[contributorId]);
            }
            for (let contributorId in bibliographicChanges) {
                contributorMap[contributorId].set('bibliographic', bibliographicChanges[contributorId]);
            }
            return node.save();
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
            //Node.save() or contributor.save(). Contributor.save() allows us to catch potential errors thrown.
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
            var node = this.get('_node');
            var child = this.store.createRecord('node', {
                title: title,
                category: category || 'project',
                description: description || null
            });
            node.get('children').pushObject(child);
            return node.save().then(() => child);
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
