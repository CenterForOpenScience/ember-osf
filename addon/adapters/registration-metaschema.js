import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    pathForType: function() {
        return 'metaschemas/registrations/';
    },
});
