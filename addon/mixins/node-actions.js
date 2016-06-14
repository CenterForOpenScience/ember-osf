import Ember from 'ember';

export default Ember.Mixin.create({
    node: null,
    model: null,
    _node: Ember.computed.or('node', 'model'),
    _contributors: {},

    /** Called when #updateNode succeeds
     *
     * @param {Node} node
     **/
    onUpdateNodeSuccess: Ember.on('updateNodeSuccess', function(/* node */) {}),
    /** Called when  #updateNode fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     **/
    onUpdateNodeFail: Ember.on('updateNodeFail', function(/* error, node */) {}),
    /** Called when #deleteNode succeeds
     **/
    onDeleteNodeSuccess: Ember.on('deleteNodeSuccess', function() {}),
    /** Called when #deleteNode fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     **/
    onDeleteNodeFail: Ember.on('deleteNodeFail', function(/* error, node */) {}),
    /** Called when #affiliateNode succeeds
     *
     * @param {Node} node
     * @param {Institution} institution
     **/
    onAffiliateNodeSuccess: Ember.on('affiliateNodeSuccess', function(/* node, institution */) {}),
    /** Called when #affiliateNode fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {Institution} institution
     **/
    onAffiliateNodeFail: Ember.on('affiliateNodeFail', function(/* error, node, institution */) {}),
    /** Called when the institutionId specified in #affiliateNode can't be found
     *
     * @param {DS.Error} error
     * @param {String} institutionId
     **/
    onInstitutionNotFound: Ember.on('institutionNotFound', function(/* error, institutionId */) {}),
    /** Called when #unaffiliateNode succeeds
     *
     * @param {Node} node
     * @param {Institution} institution
     **/
    onUnaffiliateNodeSuccess: Ember.on('unaffiliateNodeSuccess', function(/* node, institution */) {}),
    /** Called when #unaffiliateNode fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {Institution} institution
     **/
    onUnaffiliateNodeFail: Ember.on('unaffiliateNodeFail', function(/* error, node, institution */) {}),
    /** Called when #addContributor succeeds
     *
     * @param {Node} node
     * @param {Contributor} contributor
     **/
    onAddContributorSuccess: Ember.on('addContributorSuccess', function(/* node, contributor */) {}),
    /** Called when #addContributor fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {Contributor} contributor
     **/
    onAddContributorFail: Ember.on('addContributorFail', function(/* error, node, contributor */) {}),
    /** Called when #removeContributor succeeds
     *
     * @param {Node} node
     **/
    onRemoveContributorSuccess: Ember.on('removeContributorSuccess', function(/* node */) {}),
    /** Called when #removeContributor fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {Contributor} contributor
     **/
    onRemoveContributorFail: Ember.on('removeContributorFail', function(/* error, node, contributor */) {}),
    /** Called when #updateContributors succeeds
     *
     * @param {Node} node
     * @param {Contributor[]} contributors
     **/
    onUpdateContributorsSuccess: Ember.on('updateContributorsSuccess', function(/* node, contributors */) {}),
    /** Called when #updateContributors fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {Contributor[]} contributors
     **/
    onUpdateContributorsFail: Ember.on('updateContributorsFail', function(/* error, node, contributors */) {}),
    /** Called when #addChild succeeds
     *
     * @param {Node} node
     * @param {Node} child
     **/
    onAddChildSuccess: Ember.on('addChildSuccess', function(/* node, child */) {}),
    /** Called when #addChild fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {Node} child
     **/
    onAddChildFail: Ember.on('addChildFail', function(/* error, node, child */) {}),
    /** Called when #addNodeLink succeeds
     *
     * @param {Node} node
     * @param {NodeLink} nodeLink
     **/
    onAddNodeLinkSuccess: Ember.on('addNodeLinkSuccess', function(/* node, nodeLink*/) {}),
    /** Called when #addNodeLink fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {NodeLink} nodeLink
     **/
    onAddNodeLinkFail: Ember.on('addNodeLinkFail', function(/* error, node, nodeLink */) {}),
    /** Called when #removeNodeLink succeeds
     *
     * @param {Node} node
     **/
    onremoveNodeLinkSuccess: Ember.on('removeNodeLinkSuccess', function(/* node */) {}),
    /** Called when #removeNodeLink fails
     *
     * @param {DS.Error} error
     * @param {Node} node
     * @param {NodeLink} nodeLink
     **/
    onRemoveNodeLinkFail: Ember.on('removeNodeLinkFail', function(/* error, node, nodeLink */) {}),

    actions: {
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
            node.save()
                .then(() => this.send('updateNodeSuccess', node))
                .catch(e => this.send('updateNodeFail', e, node));
        },
        deleteNode() {
            var node = this.get('_node');
            node.destroyRecord()
                .then(() => this.send('deleteNodeSuccess'))
                .catch(e => this.send('deleteNodeFail', e, node));
        },
        _affiliateNode(institution) {
            var node = this.get('_node');
            node.get('affiliatedInstitutions').pushObject(institution);
            node.save()
                .then(() => this.send('affiliateNodeSuccess', node, institution))
                .catch(e => this.send('affiliateNodeFail', e, node, institution));
        },
        affiliateNode(institutionId) {
            this.store.findRecord('institution', institutionId)
                .then(institution => this._affiliateNode(institution))
                .catch(e => this.send('institutionNotFound', e, institutionId));
        },
        unaffiliateNode(institution) {
            var node = this.get('_node');
            node.get('affiliatedInstitutions').removeObject(institution);
            node.save()
                .then(() => this.send('unaffiliateNodeSuccess', node, institution))
                .catch(e => this.send('unaffiliateNodeFail', e, node, institution));
        },
        addContributor(userId, permission, isBibliographic) {
            var node = this.get('_node');
            var contributor = this.store.createRecord('contributor', {
                id: userId,
                permission: permission,
                bibliographic: isBibliographic
            });
            node.get('contributors').pushObject(contributor);
            node.save()
                .then(() => this.send('addContributorSuccess', node, contributor))
                .catch(e => this.send('addContributorFail', e, node, contributor));
        },
        removeContributor(contributor) {
            var node = this.get('_node');
            contributor.setProperties({
                nodeId: node.id
            });
            contributor.destroyRecord()
                .then(() => this.send('removeContributorSuccess', node))
                .catch(e => this.send('removeContributorFail', e, node, contributor));
        },
        _generateContributorMap(contributors) {
            // Maps all node contributors to format {contribID: {permission: "read|write|admin", bibliographic: "true|false"}}
            var contribMap = {};
            contributors.forEach(contrib => contribMap[contrib.id] = contrib);
            return contribMap;
        },
        updateContributors(contributors, permissionsChanges, bibliographicChanges) {
            var node = this.modelFor(this.routeName);
            var contributorMap = this._generateContributorMap(contributors);
            for (var contributorId in permissionsChanges) {
                var props = {};
                if (permissionsChanges[contributorId]) {
                    props.permissions = permissionsChanges[contributorId];
                }
                if (bibliographicChanges[contributorId]) {
                    props.bibliographic = bibliographicChanges[contributorId];
                }
                contributorMap[contributorId].setProperties(props);
            }
            node.save()
                .then(() => this.sendAction('updateContributorsSuccess', node, contributors))
                .catch(e => this.sendAction('updateContributorsFail', e, node, contributors));
        },
        addChild(title, description, category) {
            var node = this.get('_node');
            var child = this.store.createRecord('node', {
                title: title,
                category: category || 'project',
                description: description || null
            });
            node.get('children').pushObject(child);
            node.save()
                .then(() => this.sendAction('addChildSuccess', node, child))
                .catch(e => this.sendAction('addChildFail', e, node, child));
        },
        addNodeLink(targetNodeId) {
            var node = this.get('_node');
            var nodeLink = this.store.createRecord('node-link', {
                target: targetNodeId
            });
            node.get('nodeLinks').pushObject(nodeLink);
            node.save()
                .then(() => this.send('addNodeLinkSuccess', node, nodeLink))
                .catch(e => this.send('addNodeLinkFail', e, node, nodeLink));
        },
        removeNodeLink(nodeLink) {
            var node = this.get('_node');
            nodeLink.destroyRecord()
                .then(() => this.send('removeNodeLinkSuccess', node))
                .catch(e => this.send('removeNodeLinkFail', e, node, nodeLink));
        }
    }
});
