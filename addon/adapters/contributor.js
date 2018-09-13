import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(modelName, id, snapshot, requestType) { // jshint ignore:line
        if (requestType === 'createRecord' || requestType === 'findRecord') {
            var nodeId;
            var preprintId;
            var sendEmail = true;
            if (snapshot) {
                nodeId = snapshot.record.get('nodeId');
                sendEmail = snapshot.record.get('sendEmail');
            } else {
                nodeId = id.split('-').shift();
            }
            let type = 'node';
            let node = this.store.peekRecord('node', nodeId);
            if (!node) {
                node = this.store.peekRecord('preprint', nodeId);
                type = 'preprint';
            }

            if (node) {
                let base = this._buildRelationshipURL(
                    node._internalModel.createSnapshot(),
                    'contributors'
                );

                if (requestType === 'findRecord') {
                    return `${base}${id.split('-').pop()}/`;
                }

                // Needed for Ember Data to update the inverse record's (the node's) relationship
                if (type == 'preprint') {
                    var requestUrl = `${base}?embed=preprint`;
                } else {
                    var requestUrl = `${base}?embed=node`;
                }

                if (!sendEmail) {
                    requestUrl += `&send_email=false`;
                } else if (sendEmail === 'preprint') {
                    requestUrl += `&send_email=preprint`;
                }

                return requestUrl;
            } else {
                throw new Error('Trying to add a contributor to a Node that hasn\'t been loaded into the store');
            }
        }
        return this._super(...arguments);
    }
});
