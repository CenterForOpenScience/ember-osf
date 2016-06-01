/*
  Base adapter class for all OSF APIv2 endpoints
 */
import Ember from 'ember';
import DS from 'ember-data';

import config from 'ember-get-config';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,
    buildURL(modelName, id, snapshot, requestType) {
        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        // slash to URLs for single documents, but DRF redirects to force a trailing slash
        var url = this._super(...arguments);
        if (requestType === 'deleteRecord' || requestType === 'updateRecord' || requestType === 'findRecord') {
            if (snapshot.record.get('links.self')) {
                url = snapshot.record.get('links.self');
            }
        }
        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    },
    /**
     * Build the request payload for a relationship create/update. We're
     * using the meta hash of the relationship field to pass an optional
     * custom serialization method. This bypasses the normal serialization
     * flow, but is necessary to cooperate with the OSF APIv2.
     *
     * @method _buildRelationshipPayload
     * @param {DS.Store} store
     * @param {DS.Snapshot} snapshot
     * @param {String} relationship the relationship to build a payload for
     * @return {Object} the serialized relationship
     **/
    _relationshipPayload(store, snapshot, relationship) {
        var relationMeta = snapshot.record[relationship].meta();
        var relationType = relationMeta.type;
        var serialized;
        if (relationMeta.options.serializer) {
            serialized = relationMeta.options.serializer(snapshot.record);
        } else {
            var serializer = store.serializerFor(relationType.substring(0, relationType.length - 1));
            if (relationMeta.kind === 'hasMany') {
                // A hack, since we'd have to use a bulk requests to send a list; TODO remove [0]
                var relationArray = snapshot.hasMany(relationship);
                serialized = serializer.serialize(relationArray[relationArray.length - 1]);
            } else {
                serialized = serializer.serialize(snapshot.belongsTo(relationship));
            }
        }
        return serialized;
    },
    /**
     * Construct a URL for a relationship create/update/delete. Has the same
     * signature as buildURL, with the addition of a 'relationship' param
     *
     * @method _buildRelationshipURL
     * @param {String} relationship the relationship to build a url for
     * @return {String} a URL
     **/
    _buildRelationshipURL(modelName, id, snapshot, requestType, query, relationship) { // jshint ignore:line
        var links = relationship ? snapshot.record.get(
            `relationshipLinks.${Ember.String.underscore(relationship)}.links`
        ) : false;
        if (links) {
            return links.self ? links.self.href : links.related.href;
        } else {
            return this.buildURL(...arguments);
        }
    },
    updateRecord(store, type, snapshot, _, query) {
        var promises = null;
        var dirtyRelationships = snapshot.record.get('dirtyRelationships');
        if (dirtyRelationships.length) {
            promises = dirtyRelationships.map(relationship => {
                var url = this._buildRelationshipURL(type.modelName, snapshot.id, snapshot, 'updateRecord', query, relationship);
                var requestType = snapshot.record[relationship].meta().options.updateRequestType;
                return this.ajax(url, requestType || 'PATCH', {
                    data: this._relationshipPayload(store, snapshot, relationship)
                }).then(() => snapshot.record.clearDirtyRelationship(relationship));
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
    }
});
