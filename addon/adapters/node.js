import Ember from 'ember';
import isEnabled from 'ember-data/-private/features';

import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, snapshot, requestType) {
        var self = this;
        if (requestType === 'updateRecord' && !snapshot.record.changedAttributes().length) {
            var urls = self.findDirtyRelations(snapshot).map((rel) => {
          			var links = snapshot.record.get(
          			    `links.relationships.${Ember.String.underscore(rel)}.links`
          			);
          			return links.self ? links.self.href : links.related.href;
            });
            this.customSerialize = {};
            return urls[0];
        } else {
            // Embed contributors
            var base = this._super(...arguments);
            if (['createRecord', 'updateRecord', 'deleteRecord'].indexOf(requestType) === -1) {
                return `${base}?embed=contributors`;
            } else {
                return base;
            }
        }
    },
    updateRecord(store, type, snapshot) {
      var self = this;
      if (isEnabled('ds-improved-ajax')) {
        return this._super(...arguments);
      } else {
        var data = {};
        var id = snapshot.id;
        var url = this.buildURL(type.modelName, id, snapshot, 'updateRecord');
        if (url.indexOf('relationships') !== -1){
            data = self.relationshipPayload(snapshot, url);
        } else {
            var serializer = store.serializerFor(type.modelName);
            serializer.serializeIntoHash(data, type, snapshot, { includeId: true });
        }
        return this.ajax(url, 'PATCH', { data: data });
      }
    }
});
