import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, snap, requestType) {
        // Embed contributors
        var base = this._super(...arguments);
        var ar = base.split('/');
        ar.splice(4, 0, 'nodes/' + snap._attributes.parentId);
        return ar.join('/');
    }
});
