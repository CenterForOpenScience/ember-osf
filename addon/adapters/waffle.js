import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(modelName, id, snapshot, requestType) {
        return this._super(...arguments).replace('waffles', '_waffle');
    }
});
