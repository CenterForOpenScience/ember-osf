import OsfAdapter from './osf-adapter';
import Ember from 'ember';

export default OsfAdapter.extend({
    findHasMany(store, snapshot, url, relationship) {
        var id = snapshot.id;
        var type = snapshot.modelName;

        url = this.urlPrefix(url, this.buildURL(type, id, snapshot, 'findHasMany'));

        // If fetching user nodes, will embed root and parent. (@hmoco 12-27-17: why?)
        if (relationship.type === 'node') {
            url += '?embed=parent&embed=root';
            // TODO: revisit this, we shouldnt hard code any embeds
            if (snapshot.record.get('__' + relationship.key + 'QueryParams')) {
                url += '&' + Ember.$.param(snapshot.record.get('__' + relationship.key + 'QueryParams'));
            }
        } else if (snapshot.record.get('query-params')) {
            url += '?' + Ember.$.param(snapshot.record.get('query-params'));
        }
        return this.ajax(url, 'GET');
    }
});
