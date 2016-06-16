import Ember from 'ember';

import InfinityRoute from 'ember-osf/mixins/infinity-custom';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, InfinityRoute, {
    perPageParam: 'page[size]',
    pageParam: 'page',
    totalPagesParam: 'meta.total',

    model() {
        return this.infinityModel('node', {
            perPage: 3
        });
    },

    actions: {
        getMore() {
            this.send('infinityLoad');
        }
    },

    /**
     * Event listener that fetches more results automatically
     * As written, this does not handle fetch errors, and will not retry once an error is encountered
     */
    infinityModelUpdated() {
        this.send('infinityLoad');
    }
});
