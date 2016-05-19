import Ember from 'ember';

export default Ember.Mixin.create({
    queryParams: ['page', 'page_size'],
    // TODO: Confirm that setting to null causes server to use its default values
    page: 1,
    page_size: null,

    // Placeholders, may use pagination metadata to track this instead
    firstPage: null,
    lastPage: null,

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
