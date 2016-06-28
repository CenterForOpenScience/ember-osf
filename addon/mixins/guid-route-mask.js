import Ember from 'ember';

export default Ember.Mixin.create({
    _isGuidItem(model) {
        // TODO: Hard-coded assumptions about guid item by model type- make this nice if we see it works
        let guidModels = ['file', 'node', 'profile'];
        return guidModels.indexOf(model.constructor.modelName) !== -1;
    },

    /**
     * Get the guid associated with a model. Some models, like files, store guid on a parameter other than _id
     * @param model
     * @returns {*}
     * @private
     */
    _guidForModel(model) {
        return model.get('guid') || model.get('id');
    },

    /**
     * Route name (with segments)
     * @param routeName
     * @returns {*}
     */
    findGuidParent(routeName) {
        let model = this.modelFor(routeName);
        if (this._isGuidItem(model)) {
            return routeName;
        }

        // If this route isn't a guid route, maybe the parent is! If a parent exists, recurse; otherwise return null
        let segments = routeName.split('.');
        if (segments.length > 1) {
            let parentPath = segments.slice(0, -1).join('.');
            return this.findGuidParent(parentPath);
        }
        return null;
    },

    /**
     * Given a routeName, get the route for that, and replace it with the model GUID
     */
    maskedGuidUrl(routeName) {

        // 1. Get model for the guid section
        // 2. Generate route for parent (so we know what to replace with GUID)
        // 3.
        // TODO: This may be very fragile if we need to consider the params for the parent route(s) to that segment as arguments to `generate`
        let guidBaseModel = this.modelFor(routeName);
        let newBaseURL = '/' + this._guidForModel(guidBaseModel);

        let guidBaseRoute = this.router.generate(...arguments);
        let currentRoute = this.router.generate(this.routeName);

        let newRoute = currentRoute.replace(new RegExp('^' + guidBaseRoute), newBaseURL);
        console.log('The expected path for this route is: ', currentRoute);
        console.log('The base route for the GUID-containing segment is: ', guidBaseRoute);
        console.log('The new route will be: ', newRoute);
        console.log('The new base URL will be: ', newBaseURL);
        return newRoute;
    },

    /**
     * Detect the nearest GUID parent, and rewrite the URL accordingly
     */
    setupController() {
        let guidParentRoute = this.findGuidParent(this.routeName);

        console.log('This route is, or is a child of, a guid route. URL will be written starting from the following base: ', guidParentRoute);
        // Rewrite the URL (if supported by the currently active location implementation)
        if (guidParentRoute && this.router.location.replaceURL) {
            let newUrl = this.maskedGuidUrl(guidParentRoute);
            this.router.location.replaceURL(newUrl);
        }
        return this._super(...arguments);
    }

});
