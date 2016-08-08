import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    currentPage: 1,
    paginators: Ember.computed('currentPage', 'maxPages', 'totalSearchResults', function() {
        let currentPage = this.get('currentPage') - 1;
        var MAX_PAGES_ON_PAGINATOR = 7;
        var MAX_PAGES_ON_PAGINATOR_SIDE = 5;
        let totalSearchResults = this.get('totalSearchResults');
        var pages = Math.ceil(totalSearchResults / 10);
        var paginator = Ember.A();

        if (pages > 1) {
            paginator.pushObject('<');
            paginator.pushObject('1');
        }

        if (pages <= MAX_PAGES_ON_PAGINATOR) {
            for (var i = 1; i < pages - 1; i++) {
                paginator.pushObject(i + 1);
            }
        } else if (currentPage < MAX_PAGES_ON_PAGINATOR_SIDE - 1) {
            for (var i = 1; i < MAX_PAGES_ON_PAGINATOR_SIDE; i++) {
                paginator.pushObject(i + 1);
            }
            paginator.pushObject('...');
        } else if (currentPage > pages - MAX_PAGES_ON_PAGINATOR_SIDE) {
            paginator.pushObject('...');
            for (var i = pages - MAX_PAGES_ON_PAGINATOR_SIDE; i < pages - 1; i++) {
                paginator.pushObject(i + 1);
            }
        } else {
            paginator.pushObject('...');
            for (var i = currentPage - 1; i <= currentPage + 1; i++) {
                paginator.pushObject(i + 1);
            }
            paginator.pushObject('...');
        }

        paginator.push(pages);
        paginator.push('>');
        return paginator;
    }),
    actions: {
        findResults(query, page) {
            this.sendAction('fetchResults', query, page);
            this.set('currentPage', page);
        },
    }
});
