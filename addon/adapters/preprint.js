import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    // Override _buildRelationshipURL on ember-osf.  Instead of relationship link, need a PATCH to self link
    _buildRelationshipURL(snapshot) {
        if (snapshot.record.get('links.self')) {
            return snapshot.record.get('links.self');
        }
        return null;
    },
    // Override _doRelatedRequest on ember-osf.  Need to serializer preprint instead of file.
    _doRelatedRequest(store, snapshot, relatedSnapshots, relationship, url) {
            return this.ajax(url, 'PATCH', {
                data: store.serializerFor('preprint').serialize(snapshot),
                isBulk: false
            });
        }

});
