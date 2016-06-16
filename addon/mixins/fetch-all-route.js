import Ember from 'ember';
import InfinityRoute from 'ember-osf/mixins/infinity-custom';


export default Ember.Mixin.create(InfinityRoute, {
    perPageParam: 'page[size]',
    pageParam: 'page',
    totalPagesParam: 'meta.total',

    /**
     * Event listener that fetches more results automatically
     * As written, this does not handle fetch errors, and will not retry once an error is encountered
     */
    infinityModelUpdated() {
        this.send('infinityLoad');
    },
    
    // TODO: Add a "forceReload" action that flushes the stored results and refetches (for use with relationships)
    actions: {
        /**
         * Convenience method for clickable buttons, mainly for use with debugging
         */
        getMore() {
            this.send('infinityLoad');
        }
    }
});
