import OsfAdapter from './osf-adapter';

export default OsfAdapter.extend({
    urlForQuery(query, modelName) {
        // if query contains `q` for search, use the elasticsearch `/search/users/` endpoint
        if(query.hasOwnProperty('q')) {
            const originalPathForTypeRegEx = new RegExp(`${this.pathForType(modelName)}$`);
            return this._super(query, modelName).replace(originalPathForTypeRegEx, 'search/users');
        }
        return this._super(query, modelName);
    }
});
