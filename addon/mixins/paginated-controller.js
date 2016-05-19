import Ember from 'ember';

export default Ember.Mixin.create({
    queryParams: ['page', 'page_size'],
    page: 1,  // Current page
    page_size: null,  // Number of results per page. Param may be omitted.

    totalResults: Ember.computed('model', function() {
        return this.get('model.meta.pagination.total');
    }),
    totalPages: Ember.computed('model', 'totalResults', function() {
        let results = this.get('totalResults');
        let pageSize = this.get('model.meta.pagination.per_page');
        return Math.ceil(results / pageSize);
    }),

    actions: {
        previous() {
            // TODO: Add bounds checking somewhere
            this.decrementProperty('page', 1);
            console.log('decrement to previous');
        },
        next() {
            this.incrementProperty('page', 1);
            console.log('increment to next');
        },
        goToPage(pageNumber) {
            this.set('page', pageNumber);
            console.log('Went to page: ', this.get('page'));
        }
    }
});
