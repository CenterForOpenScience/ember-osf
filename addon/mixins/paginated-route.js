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

    /*
        Convenience method. Given a model name (and optional user params), fetch a page of records.
     */
    queryForPage(modelName, routeParams, userParams) {
        // TODO: While it would be a nicer API to fetch params from the controller directly, page_size wasn't correctly being initialized 
        
        let controller = this.controllerFor(this.routeName);

        let defaultParams = {page: controller.get('page')};
        let pageSize = controller.get('page_size');
        
        if (pageSize) {
            // TODO: if the user manually passes params,
            defaultParams['page[size]'] = pageSize;
        }

        let params = Object.assign({}, userParams || {}, defaultParams);
        console.log('qparam', params);

        //return this.store.query(modelName, params);
    }
});
