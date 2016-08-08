import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    pageToGet: null,
    numberOfPages: null,
    currentPage: 0,
    paginators: Ember.computed('currentPage', 'maxPages', 'totalSearchResults', function() {
        let currentPage = this.get('currentPage');
        let maxPages = this.get('maxPages');
        let totalSearchResults = this.get('totalSearchResults');
        var pages = Math.ceil(totalSearchResults / 10);
        if (pages > 1) {
            return [...Array(pages + 1).keys()].slice(1);
        } else {
            return [];
        }
    })
});
