/*
  Base adapter class for all OSF APIv2 endpoints
 */
import Ember from 'ember';
import DS from 'ember-data';

import HasManyQuery from 'ember-data-has-many-query';
import config from 'ember-get-config';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import {
    singularize
} from 'ember-inflector';

export default DS.JSONAPIAdapter.extend(HasManyQuery.RESTAdapterMixin, DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    buildURL(modelName, id, snapshot, requestType) {
        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        var url = this._super(...arguments);
        var options = snapshot.adapterOptions || {};
        if (requestType === 'deleteRecord' || requestType === 'updateRecord' || requestType === 'findRecord') {
            if (snapshot.record.get('links.self')) {
                url = snapshot.record.get('links.self');
            }
        } else if (options.url) {
            url = options.url;
        }

        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    },
    /**
     * Construct a URL for a relationship create/update/delete.
     *
     * @method _buildRelationshipURL
     * @param {DS.Snapshot} snapshot
     * @param {String} relationship the relationship to build a url for
     * @return {String} a URL
     **/
    _buildRelationshipURL(snapshot, relationship) {
        var links = relationship ? snapshot.record.get(
            `relationshipLinks.${Ember.String.underscore(relationship)}.links`
        ) : false;
        if (links && (links.self || links.related)) {
            return links.self ? links.self.href : links.related.href;
        }
        return null;
    },
    _createRelated(store, snapshot, createdSnapshots, relationship, url, isBulk = false) { // jshint ignore:line
        // TODO support bulk create?
        // if (isBulk) {
        //
        // }
        if (createdSnapshots.record) {
            return createdSnapshots.record.save({
                adapterOptions: {
                    nested: true,
                    url: url
                }
            });
        } else {
            return createdSnapshots.map(s => s.record.save({
                adapterOptions: {
                    nested: true,
                    url: url
                }
            }));
        }
    },
    _updateRelated(store, snapshot, updatedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, updatedSnapshots, relationship, url, 'PATCH', isBulk);
    },
    _addRelated(store, snapshot, addedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, addedSnapshots, relationship, url, 'POST', isBulk);
    },
    _removeRelated(store, snapshot, removedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, removedSnapshots, relationship, url, 'DELETE', isBulk);
    },
    _deleteRelated(store, snapshot, removedSnapshots) { // jshint ignore:line
        return this._removeRelated(...arguments).then(() => {
            if (removedSnapshots.record) {
                removedSnapshots = [removedSnapshots];
            }
            removedSnapshots.forEach(s => s.record.unloadRecord());
        });
    },
    _doRelatedRequest(store, snapshot, relatedSnapshots, relationship, url, requestMethod, isBulk = false) {
        var data = {};
        var relatedMeta = snapshot.record[relationship].meta();
        var type = singularize(relatedMeta.type);
        var serializer = store.serializerFor(type);
        if (relatedSnapshots.record) {
            serializer.serializeIntoHash(
                data,
                store.modelFor(type),
                relatedSnapshots, {
                    forRelationship: true,
                    isBulk: isBulk
                }
            );
        } else {
            data.data = relatedSnapshots.map(relatedSnapshot => {
                var item = {};
                serializer.serializeIntoHash(
                    item,
                    store.modelFor(type),
                    relatedSnapshot, {
                        forRelationship: true,
                        isBulk: isBulk
                    }
                );
                return item.data;
            });
        }
        return this.ajax(url, requestMethod, {
            data: data,
            isBulk: isBulk
        });
    },
    _handleRelatedRequest(store, type, snapshot, relationship, change) {
        var related = snapshot.record.get(`_dirtyRelationships.${relationship}.${change}`).map(r => r.createSnapshot());
        if (!related.length) {
            return [];
        }
        var relatedMeta = snapshot.record[relationship].meta();
        var url = this._buildRelationshipURL(snapshot, relationship);
        var adapter = store.adapterFor(type.modelName);
        var allowBulk = relatedMeta.options[`allowBulk${Ember.String.capitalize(change)}`];
        if (allowBulk) {
            return adapter[`_${change}Related`](
                store,
                snapshot,
                related,
                relationship,
                url,
                true
            );
        } else {
            return related.map(relatedSnapshot => adapter[`_${change}Related`](
                store,
                snapshot,
                relatedSnapshot,
                relationship,
                url,
                false
            ));
        }
    },
    updateRecord(store, type, snapshot) {
        var promises = [];
        var dirtyRelationships = snapshot.record.get('_dirtyRelationships');
        Object.keys(dirtyRelationships).forEach(relationship => {
            var changed = dirtyRelationships[relationship];
            Object.keys(changed).forEach(change => {
                promises = promises.concat(
                    this._handleRelatedRequest(
                        store, type, snapshot, relationship, change
                    ) || []
                );
            });
        });
        if (Object.keys(snapshot.record.changedAttributes()).length) {
            if (promises.length) {
                return this._super(...arguments).then(response => Ember.RSVP.allSettled(promises).then(() => response));
            }
            return this._super(...arguments);
        } else if (promises.length) {
            return Ember.RSVP.allSettled(promises).then(() => null);
        } else {
            return new Ember.RSVP.Promise((resolve) => resolve(null));
        }
    },
    ajaxOptions(_, __, options) {
        var ret = this._super(...arguments);
        if (options && options.isBulk) {
            ret.contentType = 'application/vnd.api+json; ext=bulk';
        }
        return ret;
    }
});
