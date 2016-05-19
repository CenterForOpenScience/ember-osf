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

    // Configure how pagination query params in the frontend map to the query params expected by the API backend
    //  (helps support different APIs). Most users will not need to change this.
    apiArgs: {
        page: 'page',
        page_size: 'page[size]'
    },

    /**
     * @method queryForPage  Fetch a route-specifed page of results from an external API
     * @param modelName The name of the model to query in the store
     * @param routeParams Parameters gictionary available to the model hook; must be passed in manually
     * @param userParams Additional user-specified query parameters
     * @returns {Promise}
     */
    queryForPage(modelName, routeParams, userParams) {
        let params = Object.assign({}, userParams || {}, routeParams);

        // Rename parameters to match what the API expects, and remove the old param name if necessary
        let apiArgs = this.get('apiArgs');
        for (let frontEndParamName of Object.keys(apiArgs)) {
            let backEndParamName = apiArgs[frontEndParamName];
            if (params[frontEndParamName]) {
                params[backEndParamName] = params[frontEndParamName];
            }
            if (frontEndParamName !== backEndParamName) {
                delete params[frontEndParamName];
            }
        }
        return this.store.query(modelName, params);
    }
});
