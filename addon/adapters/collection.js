import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, ___, requestType) {
        // Embed node_links
        var base = this._super(...arguments);
        if (['createRecord', 'updateRecord', 'deleteRecord'].indexOf(requestType) === -1) {
            return `${base}?embed=linked_nodes`;
        } else {
            return base;
        }
    }
});
