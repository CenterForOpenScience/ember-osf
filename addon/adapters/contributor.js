import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    generateIdForRecord: function(_, __, inputProperties) {
        return inputProperties.nodeId + '-' + inputProperties.userId;
    }
});
