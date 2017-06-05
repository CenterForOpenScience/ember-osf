import Ember from 'ember';

export default Ember.Route.extend({
    queryParams: {
        queryString: {
            replace: true
        }
    }
});
