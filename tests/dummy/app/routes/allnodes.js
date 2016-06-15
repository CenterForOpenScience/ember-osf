import Ember from 'ember';

import InfinityRoute from "ember-infinity/mixins/route";
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, InfinityRoute, {
    perPageParam: 'page[size]',
    pageParam: 'page',
    totalPagesParam: 'meta.total',

    model() {
        return this.infinityModel('node', {perPage: 3});
    },

    actions: {
        getMore() {
            console.log('sent action');
            // TODO: Put a special field where canLoadMore can find it. See if ember infinity can be made to support fetchAll actions at all, for basic model
            this.send('infinityLoad');
        }
    }
});
