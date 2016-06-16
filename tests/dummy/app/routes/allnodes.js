import Ember from 'ember';

import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import FetchAllRouteMixin from 'ember-osf/mixins/fetch-all-route';


export default Ember.Route.extend(AuthenticatedRouteMixin, FetchAllRouteMixin, {
    model() {
        return this.infinityModel('node', {
            perPage: 100
        });
    },

    /**
     * Event listener that fetches more results automatically
     * As written, this does not handle fetch errors, and will not retry once an error is encountered
     */
    infinityModelUpdated() {
        this.send('infinityLoad');
    }
});
