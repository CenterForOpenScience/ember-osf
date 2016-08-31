import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(modelName, id, snapshot, requestType) { // jshint ignore:line
        if (requestType === 'createRecord') {
            // Create operations must get URL from the parent. Otherwise, all comments will be fetched via relationship fields.
            let targetType = snapshot.adapterOptions.targetType;

            // if (targetType === 'preprint') {
            //     // Preprint comments are made through the nodes endpoint
            //     targetType = 'node';
            // }
            let parent = this.store.peekRecord(targetType, snapshot.adapterOptions.targetID);

            if (parent) {
                return this._buildRelationshipURL(
                    parent._internalModel.createSnapshot(),
                    'comments'
                );
            } else {
                throw new Error('Trying to add a comment to a record that hasn\'t been loaded into the store');
            }
        } else {
            return this._super(...arguments);
        }

    }

});
