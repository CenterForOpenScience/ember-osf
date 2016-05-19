import Ember from 'ember';

export default Ember.Mixin.create({
    queryParams: ['page', 'page_size'],
    // TODO: Confirm that setting to null causes server to use its default values
    page: null,
    page_size: null,
    
    actions: {
        prev() {
            console.log('previous');
        },
        next() {
            console.log('next');
        }
    }
});
