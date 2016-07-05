import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule mixins
 */

/**
 * Route mixin to support fetching paginated results
 *
 * Because this uses query parameters, it should be used in tandem with PaginatedControllerMixin
 *
 * @class PaginatedRouteMixin
 * @extends Ember.Mixin
 */
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
     * Fetch a route-specified page of results from an external API
     *
     * To use this argument, pass the params from the model hook as the first argument.
     * ```javascript
     * model(routeParams) {
     *   return this.queryForPage('user', routeParams);
     * }
     * ```
     *
     * @method queryForPage
     * @param modelName The name of the model to query in the store
     * @param routeParams Parameters dictionary available to the model hook; must be passed in manually
     * @param userParams Additional user-specified query parameters to further customize the query
     * @return {Promise}
     */
    queryForPage(modelName, routeParams, userParams) {
        userParams = userParams || {};
        let params = Object.assign({}, userParams || {}, routeParams);

        // TODO: Are routeParams necessary?
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
