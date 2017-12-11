import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL() {
        return this._super(...arguments).replace('waffles', '_waffle');
    }
});
