import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    currentPage: null,
    pageCount: null,

    // Bounds checking for control buttons
    disablePageReverse: Ember.computed.lte('currentPage', 1),
    disablePageForward: Ember.computed('currentPage', 'pageCount', function() {
        return this.get('currentPage') >= this.get('pageCount');
    }),

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
