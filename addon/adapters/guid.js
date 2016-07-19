import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL() {
        var url = this._super(...arguments);
        return `${url}?resolve=false`;
    }
});
