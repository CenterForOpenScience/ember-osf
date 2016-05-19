import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    currentPage: null,
    pageCount: null,

    // TODO: This actions hash feels a bit kludgy
    actions: {
        next() {
            return this.sendAction('next', ...arguments);
        },

        previous() {
            return this.sendAction('previous', ...arguments);
        },

        goToPage(pageNumber) {
            return this.sendAction('goToPage', pageNumber);
        }
    }
});
