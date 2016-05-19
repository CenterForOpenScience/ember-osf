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

    /* Convenience method. Given a model name (and optional user params), fetch a page of records. */
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
