import Ember from 'ember';

export default Ember.Mixin.create({
    node: null,
    model: null,
    _node: Ember.computed.or('node', 'model'),

    /** Maps all node contributors to format {contribID: Contributor}
     **/
    _generateContributorMap(contributors) {
        var contribMap = {};
        contributors.forEach(contrib => contribMap[contrib.id] = contrib);
        return contribMap;
    },
    _affiliateNode(node, institution) {
        node.get('affiliatedInstitutions').pushObject(institution);
        return node.save();
    },
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
            return node.save();
        },
        deleteNode() {
            var node = this.get('_node');
            return node.destroyRecord();
        },
        affiliateNode(institutionId) {
            var node = this.get('_node');
            return this.store.findRecord('institution', institutionId)
                .then(institution => this._affiliateNode(node, institution));
        },
        unaffiliateNode(institution) {
            var node = this.get('_node');
            node.get('affiliatedInstitutions').removeObject(institution);
            return node.save();
        },
        addContributor(userId, permission, isBibliographic) {
            var node = this.get('_node');
            var contributor = this.store.createRecord('contributor', {
                id: userId,
                permission: permission,
                bibliographic: isBibliographic
            });
            node.get('contributors').pushObject(contributor);
            return node.save();
        },
        removeContributor(contributor) {
            var node = this.get('_node');
            contributor.setProperties({
                nodeId: node.id
            });
            return contributor.destroyRecord();
        },
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
        addChild(title, description, category) {
            var node = this.get('_node');
            var child = this.store.createRecord('node', {
                title: title,
                category: category || 'project',
                description: description || null
            });
            node.get('children').pushObject(child);
            return node.save();
        },
        addNodeLink(targetNodeId) {
            var node = this.get('_node');
            var nodeLink = this.store.createRecord('node-link', {
                target: targetNodeId
            });
            node.get('nodeLinks').pushObject(nodeLink);
            return node.save();
        },
        removeNodeLink(nodeLink) {
            return nodeLink.destroyRecord();
        }
    }
});
