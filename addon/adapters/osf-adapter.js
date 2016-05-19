/*
  Base adapter class for all OSF APIv2 endpoints
 */
import DS from 'ember-data';

import config from 'ember-get-config';
import DataAdapterMixin from 'ember-simple-auth/mixins/data-adapter-mixin';

export default DS.JSONAPIAdapter.extend(DataAdapterMixin, {
    authorizer: 'authorizer:osf-token',
    host: config.OSF.apiUrl,
    namespace: config.OSF.apiNamespace,

    buildURL(modelName, id, snapshot, requestType, query) {  // jshint ignore:line
        var url = this._super(...arguments);
        // Fix issue where CORS request failed on 301s: Ember does not seem to append trailing
        //  slash to URLs for single documents, but DRF redirects to force a trailing slash
        if (url.lastIndexOf('/') !== 0) {
            url += '/';
        }
        return url;
    },
    findDirtyRelations(snapshot) {
        var dirtyRelationships = snapshot.record.get('dirtyRelationships');
        return Object.keys(dirtyRelationships).filter(function(rel){
            var attr = snapshot._internalModel._relationships.get(rel);
            var foo = Ember.get(dirtyRelationships, rel);
            return attr && foo && Ember.get(attr.relationshipMeta.options, 'relationshipEndpoint');
          });
    },
    relationshipPayload(snapshot, url){
      var dirty = this.findDirtyRelations(snapshot)[0];
      var url_ = url.split('/');
      var relationType = url_[url_.indexOf('relationships') + 1];
      var dirtyList = snapshot._internalModel._relationships.get(dirty).members.list;
      return {data: dirtyList.map(function(item){
          return {type: relationType, id: item.id}
      })}
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
