import Ember from 'ember';

export default Ember.Mixin.create({
    // When page numbers are updated, fetch the new results from the server
    queryParams: {
        page: {
            refreshModel: true
        },
        page_size: {
            refreshModel: true
        }
    },

    // Allow support for different APIs, by making the API pagination query param names configurable. Most users will not need to change this.
    // TODO: Use these
    pageArg: 'page',
    pageSizeArg: 'page[size]',

    /**
     * @method queryForPage  Fetch a route-specifed page of results from an external API
     * @param modelName The name of the model to query in the store
     * @param routeParams Parameters gictionary available to the model hook; must be passed in manually
     * @param userParams Additional user-specified query parameters
     * @returns {Promise}
     */
    queryForPage(modelName, routeParams, userParams) {
        let params = Object.assign({}, userParams || {}, routeParams);
        // If page_size is present, rename the url arg to to whatever URL param name the API server expects
        if (params.page_size) {
            // TODO: support making api pagination param names configurable
            params['page[size]'] = params.page_size;
        }
        delete params.page_size;
        return this.store.query(modelName, params);
    }
});
