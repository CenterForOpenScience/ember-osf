import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, snap, requestType) {
        // Modifies URL from /children/ to nodes/<parentId>/children/ to match APIv2 route for creating children.
        var base = this._super(...arguments);
        var ar = base.split('/');
        ar.splice(4, 0, 'nodes/' + snap._attributes.parentId);
        return ar.join('/');
    }
});
