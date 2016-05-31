import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, ___, requestType) {
        // Embed contributors and node_links
        var base = this._super(...arguments);
        if (['createRecord', 'updateRecord', 'deleteRecord'].indexOf(requestType) === -1) {
            return `${base}?embed=contributors&embed=node_links`;
        } else {
            return base;
        }
    }
});
