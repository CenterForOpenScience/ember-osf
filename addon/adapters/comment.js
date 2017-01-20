import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(modelName, id, snapshot, requestType) { // jshint ignore:line
        if (requestType === 'createRecord') {
            // Create operations must get URL from the parent. Otherwise, all comments will be fetched via relationship fields.
            let targetType = snapshot.adapterOptions.targetType;

            let parent = this.store.peekRecord(targetType, snapshot.adapterOptions.targetID);

            if (parent) {
                // Get the relationship URL from the appropriately named field, based on the target type
                const relTarget = (targetType === 'comment') ? 'replies' : 'comments';
                return this._buildRelationshipURL(
                    parent._internalModel.createSnapshot(),
                    relTarget
                );
            } else {
                throw new Error('Trying to add a comment to a record that hasn\'t been loaded into the store');
            }
        } else {
            return this._super(...arguments);
        }

    }

});
