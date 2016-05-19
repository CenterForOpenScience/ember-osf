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

    buildURL(modelName, id, snapshot, requestType, query) { // jshint ignore:line
        if (requestType === 'updateRecord' && !snapshot.record.changedAttributes().length) {
            var urls = snapshot.record.get('dirtyRelationships').map((rel) => {
                var links = snapshot.record.get(
                    `links.relationships.${Ember.String.underscore(rel)}.links`
                );
		return links.self ? links.self.href : links.related.href;
            });
            return urls[0];
        } else {
            var url = this._super(...arguments);
            // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
            //  slash to URLs for single documents, but DRF redirects to force a trailing slash
            if (url.lastIndexOf('/') !== 0) {
                url += '/';
            }
            return url;
        }
    },
    relationshipPayload(snapshot, dirty, store) {
	var relationMeta = snapshot.record[dirty].meta();
	var relationType = relationMeta.type;
	var Serializer = relationMeta.options.serializer || store.serializerFor(
	    relationType
	);
	var serializer = new Serializer();
        return {
            data: snapshot.record.get(dirty).map((record) => {
		return serializer.serialize(new DS.Snapshot(record._internalModel));
	    })
        };
    },
    updateRecord(store, type, snapshot) {
	var dirtyRelationships = snapshot.record.get('dirtyRelationships');
	if (dirtyRelationships.length) {
	    var dirty = dirtyRelationships[0];
            var url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord', dirty);
	    return this.ajax(url, 'PATCH', {
                data: this.relationshipPayload(snapshot, dirty, store)
            });

	} else {
            return this._super(...arguments);
	}
    }
});
