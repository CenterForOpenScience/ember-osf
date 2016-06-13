import Ember from 'ember';

export default Ember.Mixin.create({
    node: null,
    model: null,
    _node: Ember.computed.or('node', 'model'),
    _contributors: {},

    actions: {
        _updateNode(title, description, category, isPublic) {
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
                .then(() => this.send('nodeUpdated', node))
                .catch(e => this.send('nodeUpdateFailed', e, node));
        },
        deleteNode() {
            var node = this.get('_node');
            node.destroyRecord()
                .then(() => this.send('nodeDeleted'))
                .catch(e => this.send('nodeDeleteFailed', e, node));
        },
        _affiliateNode(institution) {
            var node = this.get('_node');
            node.get('affiliatedInstitutions').pushObject(institution);
            node.save()
                .then(() => this.send('nodeAffiliationAdded', node, institution))
                .catch(e => this.send('nodeAffiliationAddFailed', e, node, institution));
        },
        affiliateNode(institutionId) {
            this.store.findRecord('institution', institutionId)
                .then(institution => this._affiliateNode(institution))
                .catch(e => this.send('institutionNotFound', e, institutionId));
        },
        _deaffiliateNode(institution) {
            var node = this.get('_node');
            node.get('affiliatedInstitutions').removeObject(institution);
            node.save()
                .then(() => this.send('nodeAffiliationRemoved', node, institution))
                .catch(e => this.send('nodeAffiliationRemoveFailed', e, node, institution));
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
                .then(() => this.send('nodeContributorAdded', node, contributor))
                .catch(e => this.send('nodeContributorAddFailed', e, node, contributor));
        },
        removeContributor(contributor) {
            var node = this.get('_node');
            contributor.setProperties({
                nodeId: node.id
            });
            contributor.destroyRecord()
                .then(() => this.send('nodeContributorDeleted', node))
                .catch(e => this.send('nodeContributorDeleteFailed', e, node, contributor));
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
                .then(() => this.sendAction('nodeContributorsUpdated', node, contributors))
                .catch(e => this.sendAction('nodeContributorUpdateFailed', e, node, contributors));
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
                .then(() => this.sendAction('nodeChildAdded', node, child))
                .catch(e => this.sendAction('nodeChildAddFailed', e, node, child));
        },
        addNodeLink(targetNodeId) {
            var node = this.get('_node');
            var nodeLink = this.store.createRecord('node-link', {
                target: targetNodeId
            });
            node.get('nodeLinks').pushObject(nodeLink);
            node.save()
                .then(() => this.send('nodeLinkAdded', node, nodeLink))
                .catch(e => this.send('nodeLinkAddFailed', e, node, nodeLink));
        },
        removeNodeLink(nodeLink) {
            var node = this.get('_node');
            nodeLink.destroyRecord()
                .then(() => this.send('nodeLinkDeleted', node))
                .catch(e => this.send('nodeLinkDeleteFailed', e, node, nodeLink));
        }
    }
});
