import Ember from 'ember';

import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, snapshot, requestType) {
        if (requestType === 'updateRecord' && !snapshot.record.changedAttributes().length) {
            var dirtyRelationships = snapshot.record.get('dirtyRelationships');
            var urls = Object.keys(dirtyRelationships)
                .filter((rel) => Ember.get(dirtyRelationships, rel))
                    .map((rel) => {
			var links = snapshot.record.get(
			    `links.${Ember.String.underscore(rel)}.links`
			);
			return Ember.get(links, 'self.href') || links.related.href;
		    });
	    // TODO fixme
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
    }
});
