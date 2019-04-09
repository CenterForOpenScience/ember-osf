import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    namespace: '_/chronos',
    pathForType: function () {
        return 'journals';
    }
});
