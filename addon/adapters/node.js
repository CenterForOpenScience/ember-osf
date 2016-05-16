import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL(_, __, ___, requestType) {
        // Embed contributors
        //debugger;
        var base = this._super(...arguments);
        if (['createRecord', 'updateRecord', 'deleteRecord'].indexOf(requestType) === -1) {
            return `${base}?embed=contributors`;
        } else {
            return base;
        }
    },
});
