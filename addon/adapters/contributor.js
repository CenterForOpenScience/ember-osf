import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    generateIdForRecord: function(_, __, inputProperties) {
        return inputProperties.nodeId + '-' + inputProperties.userId;
    },
    buildURL(modelName, id, snapshot, requestType) { // jshint ignore:line
        if (requestType === 'createRecord') {
            var nodeId;
            if (snapshot) {
                nodeId = snapshot.record.get('nodeId');
            } else {
                nodeId = id.split('-').shift();
            }

            let node = this.store.peekRecord('node', nodeId);
            if (node) {
                let base = this._buildRelationshipURL(
                    node._internalModel.createSnapshot(),
                    'contributors'
                );
		// Needed for Ember Data to update the inverse record's (the node's) relationship
                return `${base}?embed=node`;
            } else {
                // fail?
            }
        }
        return this._super(...arguments);
    }
});
