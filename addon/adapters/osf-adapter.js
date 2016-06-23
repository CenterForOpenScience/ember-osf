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

let {
    camelize
} = Ember.String;

export default DS.JSONAPIAdapter.extend(HasManyQuery.RESTAdapterMixin, DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    buildURL(modelName, id, snapshot, requestType) {
        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        var url = this._super(...arguments);
        var options = (snapshot ? snapshot.adapterOptions : false) || {};
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
    /**
     * Handle creation of related resources
     *
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} createdSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
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
    /**
     * Handle add(s) of related resources. This differs from CREATEs in that the related
     * record is already saved and is just being associated with the inverse record.
     *
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} addedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _addRelated(store, snapshot, addedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, addedSnapshots, relationship, url, 'POST', isBulk);
    },
    /**
     * Handle update(s) of related resources
     *
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} updatedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _updateRelated(store, snapshot, updatedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, updatedSnapshots, relationship, url, 'PATCH', isBulk);
    },
    /**
     * Handle removal of related resources. This differs from DELETEs in that the related
     * record is not deleted, just dissociated from the inverse record.
     *
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} removedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _removeRelated(store, snapshot, removedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, removedSnapshots, relationship, url, 'DELETE', isBulk).then(response => response || []);
    },
    /**
     * Handle deletion of related resources
     *
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} deletedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _deleteRelated(store, snapshot, deletedSnapshots) { // jshint ignore:line
        return this._removeRelated(...arguments).then(() => {
            if (deletedSnapshots.record) {
                deletedSnapshots = [deletedSnapshots];
            }
            deletedSnapshots.forEach(s => s.record.unloadRecord());
        });
    },
    /**
     * A helper for making _*Related requests
     *
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} relatedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {String} requestMethod
     * @param {Boolean} isBulk
     **/
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
        }).then(res => {
            if (!res) {
                if (requestMethod === 'DELETE') {
                    res = [];
                } else {
                    return null;
                }
            }
            return res;
        });
    },
    /**
     * Delegate a series of requests based on a snapshot, relationship, and a change.
     * The change argument can be 'delete', 'remove', 'update', 'add', 'create'
     *
     * @param {DS.Store} store
     * @param {DS.Model} type
     * @param {DS.Snapshot} snapshot
     * @param {String} relationship
     * @param {String} change
     **/
    _handleRelatedRequest(store, type, snapshot, relationship, change) {
        var related = snapshot.record.get(`_dirtyRelationships.${relationship}.${change}`).map(r => r.createSnapshot());
        // TODO(samchrisinger): will this have unintented side-effects for deletes/removes?
        if (!related.length) {
            return [];
        }

        var relatedMeta = snapshot.record[relationship].meta();
        var url = this._buildRelationshipURL(snapshot, relationship);
        var adapter = store.adapterFor(type.modelName);
        var allowBulk = relatedMeta.options[`allowBulk${Ember.String.capitalize(change)}`];
        var response;
        if (allowBulk) {
            response = adapter[`_${change}Related`](
                store,
                snapshot,
                related,
                relationship,
                url,
                true
            );
        } else {
            response = Ember.RSVP.allSettled(
                related.map(relatedSnapshot => adapter[`_${change}Related`](
                    store,
                    snapshot,
                    relatedSnapshot,
                    relationship,
                    url,
                    false
                ))
            );
        }
        return response.then(this._combineResults);
    },
    /**
     * Combine a set of results from Ember.RSVP.allSettled into a single list
     * see: http://emberjs.com/api/classes/RSVP.html#method_allSettled
     *
     * @param {Object} result
     **/
    _combineResults(results) {
        var data = [];
        results.forEach(result => {
            if (result.state === 'fulfilled') {
                data.push(...(result.value.data || []));
            }
        });
        return {
            data: data.map(id => {
                id.type = camelize(singularize(id.type));
                return id;
            })
        };
    },
    updateRecord(store, type, snapshot) {
        var relatedRequests = {};
        var dirtyRelationships = snapshot.record.get('_dirtyRelationships');
        Object.keys(dirtyRelationships).forEach(relationship => {
            var promises = [];
            var changed = dirtyRelationships[relationship];
            Object.keys(changed).forEach(change => {
                promises = promises.concat(
                    this._handleRelatedRequest(
                        store, type, snapshot, relationship, change
                    ) || []
                );
            });
            if (promises.length) {
                relatedRequests[relationship] = Ember.RSVP.allSettled(promises).then(this._combineResults);
            }
        });
        var relatedPromise = Ember.RSVP.hashSettled(relatedRequests).then(results => {
            var updatedData = {};
            Object.keys(results).forEach(relationship => {
                let result = results[relationship];
                if (result.state === 'fulfilled') {
                    updatedData[relationship] = result.value;
                }
            });
            store._setupRelationships(snapshot.record._internalModel, {
                relationships: updatedData
            });
        });
        if (Object.keys(snapshot.record.changedAttributes()).length) {
            return this._super(...arguments).then(response => relatedPromise.then(() => response));
        } else {
            return relatedPromise.then(() => null);
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
