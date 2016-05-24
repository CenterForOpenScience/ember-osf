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

    buildURL(modelName, id, snapshot, requestType, query, dirtyRelationship) { // jshint ignore:line
	      var url;
        var links = dirtyRelationship ? snapshot.record.get(
            `links.relationships.${Ember.String.underscore(dirtyRelationship)}.links`
        ) : false;
        if (links) {
            url = links.self ? links.self.href : links.related.href;
        } else {
            url = this._super(...arguments);
        }
	// Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        //  slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== url.length - 1) {
            url += '/';
        }
        return url;
    },
    relationshipPayload(snapshot, dirty, store) {
        var relationMeta = snapshot.record[dirty].meta();
        var relationType = relationMeta.type;
        var serialized;
        if (relationMeta.options.serializer) {
          serialized = relationMeta.options.serializer(snapshot);
        } else {
          var serializer = store.serializerFor(relationType);
          var toBeSent = snapshot.record.get(dirty).filter(
            function(record){
              return record.id === null;
            }
          );
          //under the assumption relationship saves are atomic, only one component is added at a time.
          serialized = serializer.serialize(new DS.Snapshot(toBeSent[0]._internalModel));
          // for some reason this is not hitting the node overloaded serialize method
          delete serialized.data.relationships;
        }
        return serialized;
    },
    updateRecord(store, type, snapshot, _, query) {
        var dirtyRelationships = snapshot.record.get('dirtyRelationships');
        if (dirtyRelationships.length) {
            var dirty = dirtyRelationships.pop();
            var url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord', query, dirty);
            var requestType = snapshot.record[dirty].meta().options.updateRequestType;
            return this.ajax(url, requestType || 'PATCH', {
                data: this.relationshipPayload(snapshot, dirty, store)
            });

        } else {
            return this._super(...arguments);
        }
    }
});
