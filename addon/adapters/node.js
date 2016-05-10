import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL() {
        // Embed contributors
        // TODO: We only want to add the embed parameter on GET requests (not POST)
        return `${this._super(...arguments)}?embed=contributors`;
    }
});
