/*
  Base adapter class for all OSF APIv2 endpoints
 */
import Ember from 'ember';
import DS from 'ember-data';

import config from 'ember-get-config';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

import {
    singularize
} from 'ember-inflector';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
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
     * Construct a URL for a relationship create/update/delete. Has the same
     * signature as buildURL, with the addition of a 'relationship' param
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
    _saveRelated(snapshot, relationship, url, isBulk=false) {
	return snapshot.record.save({
            adapterOptions: {
		nested: true,
		url: url,
		isBulk: isBulk
            }
	}).then((response) => {
	    snapshot.record.clearDirtyRelationship(relationship);
	    return response;
	});
    },
    _addRelated(store, snapshot, addedSnapshots, relationship, url) {
        var data = {};
        var relatedMeta = snapshot.record[relationship].meta();

	var type = singularize(relatedMeta.type);
        var serializer = store.serializerFor(type);
        data.data = addedSnapshots.map(addedSnapshot => {
            return serializer.serializeIntoHash(
                data,
                store.modelFor(type),
                addedSnapshot, {
                    forRelationship: true
                });
        });
        return this.ajax(url, 'POST', {
            data: data
        });
    },
    _removeRelated(store, snapshot, addedSnapshots, relationship, url) {
        var data = {};
        var relatedMeta = snapshot.record[relationship].meta();

	var type = singularize(relatedMeta.type);
        var serializer = store.serializerFor(type);
        data.data = addedSnapshots.map(addedSnapshot => {
            return serializer.serializeIntoHash(
                data,
                store.modelFor(type),
                addedSnapshot, {
                    forRelationship: true
                });
        });
        return this.ajax(url, 'DELETE', {
            data: data
        });
    },
    _handleRelatedRequest(store, type, snapshot, relationship, change) {
        var related = snapshot.record.get(`_dirtyRelationships.${relationship}.${change}`);
	if (!related.length) {
	    return [];
	}
	var relatedMeta = snapshot.record[relationship].meta();

	var url = this._buildRelationshipURL(snapshot, relationship);
	var promises = [];


	var adapter = store.adapterFor(type.modelName);
	if (change === 'added') {
	    promises.push(
		...adapter._addRelated(
		    store,
		    snapshot,
		    related,
		    relationship,
		    url
		)
	    );
	} else if (change === 'removed') {
	    promises.push(
		...adapter._removeRelated(
		    store,
		    snapshot,
		    related,
		    relationship,
		    url
		)
	    );
	} else {
            if (relatedMeta.options[`allowBulk${Ember.String.capitalize(change)}`]) {
		promises.push(
		    this._saveRelated(
			related,
			relationship,
			url,
			true
		    )
		);
            } else {
		promises.push(...related.map(relatedSnapshot => this._saveRelated(
		    relatedSnapshot,
		    relationship,
		    url
		)));
            }
	}
	return promises;
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
