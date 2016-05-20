import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, snapshot, requestType) {
        // Embed contributors
        var base = this._super(...arguments);
        if (['createRecord', 'updateRecord', 'deleteRecord'].indexOf(requestType) === -1) {
            return `${base}?embed=contributors`;
        } else {
            return base;
        }
    }
});
