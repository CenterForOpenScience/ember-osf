import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(_, __, ___, requestType) {
        // TODO Not the best way to do this
        var base = this._super(...arguments);
        base = base.replace('preprint_providers', 'providers/preprints');
        return base;
    }
});
