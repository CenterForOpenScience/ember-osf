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
      var url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');
      if (url.indexOf('relationships') !== -1){
          data = self.relationshipPayload(snapshot, url);
          return this.ajax(url, 'PATCH', { data: data });
      } else {
          return this._super(...arguments);
      }
    }
});
