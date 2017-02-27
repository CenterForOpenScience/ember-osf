import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL() {
        // Always force this request to resolve to dest resource
        const baseUrl = this._super(...arguments);
        return `${baseUrl}?resolve`;
    }
});
