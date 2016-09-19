import OsfAdapter from './osf-adapter';
import Ember from 'ember';

export default OsfAdapter.extend({
    findHasMany(store, snapshot, url, relationship) {
        var id = snapshot.id;
        var type = snapshot.modelName;

        url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

        // If fetching user nodes, will embed root and parent.
        if (relationship.type === 'node') {
            var embedParams = 'embed=parent&embed=root';
            if (snapshot.record.get('query-params')) {
                var queryParams = Ember.$.param(snapshot.record.get('query-params'));
                url += '?' + queryParams;
                url += '&' + embedParams;
            } else {
                url += '?' + embedParams;
            }
        }
        return this.ajax(url, 'GET');
    }
});
