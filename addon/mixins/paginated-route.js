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

    /**
     * Allow configuration of the backend URL parameter used for page #
     * @property pageParam
     * @type String
     * @default "page"
     */
    pageParam: 'page',

    /**
     * Allow configuration of the backend URL parameter for number of results per page
     * @property perPageParam
     * @type String
     * @default "page[size]"
     */
    perPageParam: 'page[size]',

    /**
     * @method queryForPage  Fetch a route-specified page of results from an external API
     * @param modelName The name of the model to query in the store
     * @param routeParams Parameters dictionary available to the model hook; must be passed in manually
     * @param userParams Additional user-specified query parameters
     * @return {Promise}
     */
    queryForPage(modelName, routeParams, userParams) {
        userParams = userParams || {};
        let params = Object.assign({}, userParams || {}, routeParams);

        // Rename the ember-route URL params to what the backend API expects, and remove the old param if necessary
        const page = params.page;
        delete params.page;

        const pageSize = params.page_size;
        delete params.page_size;
        if (page) {
            params[this.get('pageParam')] = page;
        }
        if (pageSize) {
            params[this.get('perPageParam')] = pageSize;
        }
        return this.store.query(modelName, params);
    }
});
