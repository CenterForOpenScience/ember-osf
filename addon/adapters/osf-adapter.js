import Ember from 'ember';
import DS from 'ember-data';

import HasManyQuery from 'ember-data-has-many-query';
import config from 'ember-get-config';
import GenericDataAdapterMixin from 'ember-osf/mixins/generic-data-adapter';

import {
    singularize
} from 'ember-inflector';

/**
 * @module ember-osf
 * @submodule adapters
 */

/**
 * Base adapter class for all OSF APIv2 endpoints
 *
 * @class OsfAdapter
 * @extends DS.JSONAPIAdapter
 * @uses HasManyQuery.RESTAdapterMixin
 * @uses GenericDataAdapterMixin
 */
export default DS.JSONAPIAdapter.extend(HasManyQuery.RESTAdapterMixin, GenericDataAdapterMixin, {
    headers: {
        ACCEPT: 'application/vnd.api+json; version=2.4'
    },
    authorizer: config['ember-simple-auth'].authorizer,
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    /**
     * Overrides buildQuery method - Allows users to embed resources with findRecord
     * OSF APIv2 does not have "include" functionality, instead we use 'embed'.
     * Usage: findRecord(type, id, {include: 'resource'}) or findRecord(type, id, {include: ['resource1', resource2]})
     * Swaps included resources with embedded resources
     *
     * @method buildQuery
     */
    buildQuery() {
        let query = this._super(...arguments);
        if (query.include) {
            query.embed = query.include;
        }
        delete query.include;
        return query;
    },
    buildURL(modelName, id, snapshot, requestType) {
        var url = this._super(...arguments);
        var options = (snapshot ? snapshot.adapterOptions : false) || {};
        if (requestType === 'deleteRecord' || requestType === 'updateRecord' || requestType === 'findRecord') {
            if (snapshot.record.get('links.self')) {
                url = snapshot.record.get('links.self');
            }
        } else if (options.url) {
            url = options.url;
        }

        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    },
    /**
     * Construct a URL for a relationship create/update/delete.
     *
     * @method _buildRelationshipURL
     * @private
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
     * @method _createRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} createdSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _createRelated(store, snapshot, createdSnapshots, relationship, url) { //, isBulk = false) {
        // TODO support bulk create?
        // if (isBulk) {
        //
        // }
        return createdSnapshots.map(s => s.record.save({
            adapterOptions: {
                nested: true,
                url: url,
                requestType: 'create'
            }
        }).then(res => {
            snapshot.record.resolveRelationship(relationship).addCanonicalRecord(s.record._internalModel);
            return res;
        }));
    },
    /**
     * Handle add(s) of related resources. This differs from CREATEs in that the related
     * record is already saved and is just being associated with the inverse record.
     *
     * @method _addRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} addedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _addRelated(store, snapshot, addedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, addedSnapshots, relationship, url, 'POST', isBulk).then(res => {
            addedSnapshots.forEach(function(s) {
                snapshot.record.resolveRelationship(relationship).addCanonicalRecord(s.record._internalModel);
            });
            return res;
        });
    },
    /**
     * Handle update(s) of related resources
     *
     * @method _updateRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} updatedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _updateRelated(store, snapshot, updatedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, updatedSnapshots, relationship, url, 'PATCH', isBulk).then(res => {
            var relatedType = singularize(snapshot.record[relationship].meta().type);
            res.data.forEach(item => {
                var record = store.push(store.normalize(relatedType, item));
                snapshot.record.resolveRelationship(relationship).addCanonicalRecord(record._internalModel);
            });
            return res;
        });
    },
    /**
     * Handle removal of related resources. This differs from DELETEs in that the related
     * record is not deleted, just dissociated from the inverse record.
     *
     * @method _removeRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} removedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _removeRelated(store, snapshot, removedSnapshots, relationship, url, isBulk = false) {
        return this._doRelatedRequest(store, snapshot, removedSnapshots, relationship, url, 'DELETE', isBulk).then(res => {
            removedSnapshots.forEach(s => snapshot.record.resolveRelationship(relationship).removeCanonicalRecord(s.record._internalModel));
            return res || [];
        });
    },
    /**
     * Handle deletion of related resources
     *
     * @method _deleteRelated
     * @private
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot snapshot of inverse record
     * @param {DS.Snapshot[]} deletedSnapshots
     * @param {String} relationship
     * @param {String} url
     * @param {Boolean} isBulk
     **/
    _deleteRelated(store, snapshot, deletedSnapshots) { //, relationship, url, isBulk = false) {
        return this._removeRelated(...arguments).then(() => {
            deletedSnapshots.forEach(s => s.record.unloadRecord());
        });
    },
    /**
     * A helper for making _*Related requests
     *
     * @method _doRelatedRequest
     * @private
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
        if (relatedMeta.options.serializerType) {
            serializer = store.serializerFor(relatedMeta.options.serializerType);
        }
        if (Ember.isArray(relatedSnapshots)) {
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
                if (Ember.isArray(item.data) && item.data.length === 1) {
                    return item.data[0];
                }
                return item.data;
            });
        } else {
            serializer.serializeIntoHash(
                data,
                store.modelFor(type),
                relatedSnapshots, {
                    forRelationship: true,
                    isBulk: isBulk
                }
            );
        }
        return this.ajax(url, requestMethod, {
            data: data,
            isBulk: isBulk
        }).then(res => {
            if (res && !Ember.$.isArray(res.data)) {
                res.data = [res.data];
            }
            return res;
        });
    },
    /**
     * Delegate a series of requests based on a snapshot, relationship, and a change.
     * The change argument can be 'delete', 'remove', 'update', 'add', 'create'
     *
     * @method _handleRelatedRequest
     * @private
     * @param {DS.Store} store
     * @param {DS.Model} type
     * @param {DS.Snapshot} snapshot
     * @param {String} relationship
     * @param {String} change
     **/
    _handleRelatedRequest(store, type, snapshot, relationship, change) {
        var related = snapshot.record.get(`_dirtyRelationships.${relationship}.${change}`).map(function(r) {
            if (r._internalModel) {
                return r._internalModel.createSnapshot();
            }
            return r.createSnapshot();
        });
        if (!related.length) {
            return [];
        }

        var relatedMeta = snapshot.record[relationship].meta();
        var url = this._buildRelationshipURL(snapshot, relationship);
        var adapter = store.adapterFor(type.modelName);
        var allowBulk = relatedMeta.options[`allowBulk${Ember.String.capitalize(change)}`];

        if (related.record) {
            related = [related];
        }

        var response;
        response = adapter[`_${change}Related`](
            store,
            snapshot,
            related,
            relationship,
            url,
            allowBulk
        );
        return response;
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
                relatedRequests[relationship] = Ember.RSVP.allSettled(promises);
            }
        });
        var relatedPromise = Ember.RSVP.hashSettled(relatedRequests);
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
    },
    pathForType(modelName) {
        var underscored = Ember.String.underscore(modelName);
        return Ember.String.pluralize(underscored);
    }
});
