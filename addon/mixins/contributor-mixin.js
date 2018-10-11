import Ember from 'ember';

export default Ember.Mixin.create({
    /**
     * Determine whether the specified user ID is a contributor on this node
     * @method isContributor
     * @param {String} userId
     * @return {boolean} Whether the specified user is a contributor on this node
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
            contributors.members.list.filter(m => !m.getRecord().get('isNew') && Object.keys(m.getRecord().changedAttributes()).length > 0)
        );
        // Need to included created contributors even in relationship
        // hasLoaded is false
        this.set(
            '_dirtyRelationships.contributors.create',
            contributors.members.list.filter(m => m.getRecord().get('isNew'))
        );
        // Contributors are a 'real' delete, not just a de-reference
        this.set(
            '_dirtyRelationships.contributors.delete',
            this.get('_dirtyRelationships.contributors.remove') || []
        );
        this.set('_dirtyRelationships.contributors.remove', []);
        return promise;
    },
    addContributor(userId, permission, isBibliographic, sendEmail, fullName, email) {
        let contrib = this.store.createRecord('contributor', {
            permission: permission,
            bibliographic: isBibliographic,
            sendEmail: sendEmail,
            nodeId: this.get('id'),
            userId: userId,
            fullName: fullName,
            email: email
        });

        return contrib.save();
    },

    addContributors(contributors, sendEmail) {
        let payload = contributors.map(contrib => {
            let contribData = {
                permission: contrib.permission,
                bibliographic: contrib.bibliographic,
                nodeId: this.get('id'),
                userId: contrib.userId,
                id: this.get('id') + '-' + contrib.userId,
            };
            if (contrib.unregisteredContributor) {
                contribData['fullName'] = contrib.unregisteredContributor;
            }
            let c = this.store.createRecord('contributor', contribData);

            return c.serialize({
                includeId: true,
                includeUser: true
            }).data;
        });

        let emailQuery = '';
        if (!sendEmail) {
            emailQuery = '?send_email=false';
        } else if (sendEmail === 'preprint') {
            emailQuery = '?send_email=preprint';
        }

        // TODO Get this working properly - should not be an ajax request in the future.
        return this.store.adapterFor('contributor').ajax(this.get('links.relationships.contributors.links.related.href') + emailQuery, 'POST', {
            data: {
                data: payload
            },
            isBulk: true
        }).then(resp => {
            this.store.pushPayload(resp);
            var createdContribs = Ember.A();
            resp.data.map((contrib) => {
                createdContribs.push(this.store.peekRecord('contributor', contrib.id));
            });
            return createdContribs;
        });
    },

    removeContributor(contributor) {
        return contributor.destroyRecord().then(rec => {
            this.get('store')._removeFromIdMap(rec._internalModel);
        });
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
