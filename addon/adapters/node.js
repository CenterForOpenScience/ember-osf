import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({
    buildURL() {
        // Embed contributors
        return `${this._super(...arguments)}?embed=contributors`;
    }
});
