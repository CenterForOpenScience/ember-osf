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
    _handleRelatedRequest(store, type, snapshot, relationship) {
        var related = snapshot.record._peekRelationship(relationship);
	var relatedMeta = snapshot.record[relationship].meta();

	var url = this._buildRelationshipURL(snapshot,  relationship);
	var promises = [];

	var newRecords = related.filter(related => related.record.get('isNew'));
        if (newRecords.length) {
            /* TODO allow bulk create?
	     if (relatedMeta.options.allowBulkCreate) {
		console.log(`Warning: Bulk create requests are at best poorly supported.
 We cannot guarentee the store will be updated with the results of these creates, and
 reccommend that you manually reload this relationship if the request succeeds.`);
		promises.push(this._makeManyRequest(

		    'POST',
		    serializer.serialize(dirtyRecords),
		    true
		).then(() => null));
	    } else {
	     */
            promises.push(...newRecords.map(newSnapshot => {
		return this._saveRelated(
		    newSnapshot,
		    relationship,
		    url
		);
	    }));
	}
        var dirtyRecords = related.filter(related => related.record.isNewOrDirty() && !related.record.get('isNew'));
        if (dirtyRecords.length) {
            if (relatedMeta.options.allowBulkUpdate) {
		promises.push(
		    this._saveRelated(
			dirtyRecords,
			relationship,
			url,
			true
		    )
		);
            } else {
                promises.push(...dirtyRecords.map(dirtySnapshot => this._saveRelated(
		    dirtySnapshot,
		    relationship,
		    url
		)));
            }
        }
	// TODO
    },
    updateRecord(store, type, snapshot) {
        var promises = null;
        var dirtyRelationships = snapshot.record.get('dirtyRelationships');
        if (dirtyRelationships.length) {
            promises = dirtyRelationships.map(relationship => {
		return this._handleRelatedRequest(store, type, snapshot, relationship);
            });
        }
        if (Object.keys(snapshot.record.changedAttributes()).length) {
            if (promises) {
                return this._super(...arguments).then(response => Ember.RSVP.allSettled(promises).then(() => response));
            }
            return this._super(...arguments);
        } else if (promises) {
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
