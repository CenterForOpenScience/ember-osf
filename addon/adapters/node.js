import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    buildURL(modelName, id, snapshot, requestType) { // jshint ignore:line
        if (requestType === 'createRecord') {
            let parent = snapshot.record.belongsTo('parent').belongsToRelationship.members.list[0];
            if (parent) {
                return this._buildRelationshipURL(
                    parent.createSnapshot(),
                    'children'
                );
            }
        }
        let url = this._super(...arguments);
        return `${url}?embed=preprints&embed=parent`;
    }
});
