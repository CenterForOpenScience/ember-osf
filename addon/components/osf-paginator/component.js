import Ember from 'ember';
import layout from './template';

// Ember component that is very similar to osf/website/static/js/paginator.js
export default Ember.Component.extend({
    layout,
    currentPage: 1,
    pages: Ember.computed('totalSearchResults', function() {
        let totalSearchResults = this.get('totalSearchResults');
        return Math.ceil(totalSearchResults / 10);
    }),
    paginators: Ember.computed('currentPage', 'pages', function() {
        let currentPage = this.get('currentPage') - 1;
        var MAX_PAGES_ON_PAGINATOR = 7;
        var MAX_PAGES_ON_PAGINATOR_SIDE = 5;
        var pages = this.get('pages');
        var paginator = Ember.A();

        if (pages > 1) {
            paginator.pushObject('<');
            paginator.pushObject(1);
        }

        if (pages <= MAX_PAGES_ON_PAGINATOR) {
            for (var i = 1; i < pages - 1; i++) {
                paginator.pushObject(i + 1);
            }
        } else if (currentPage < MAX_PAGES_ON_PAGINATOR_SIDE - 1) {
            for (var j = 1; j < MAX_PAGES_ON_PAGINATOR_SIDE; j++) {
                paginator.pushObject(j + 1);
            }
            paginator.pushObject('...');
        } else if (currentPage > pages - MAX_PAGES_ON_PAGINATOR_SIDE) {
            paginator.pushObject('...');
            for (var k = pages - MAX_PAGES_ON_PAGINATOR_SIDE; k < pages - 1; k++) {
                paginator.pushObject(k + 1);
            }
        } else {
            paginator.pushObject('...');
            for (var l = currentPage - 1; l <= currentPage + 1; l++) {
                paginator.pushObject(l + 1);
            }
            paginator.pushObject('...');
        }

        paginator.push(pages);
        paginator.push('>');
        return paginator;
    }),
    actions: {
        findResults(query, page) {
            this.attrs.fetchResults(query, page).then(() => {
                this.set('currentPage', page);
            });

        },
        nextPage(query) {
            var page = this.get('currentPage');
            if (page < this.get('pages')) {
                this.send('findResults', query, page + 1);
            }
        },
        previousPage(query) {
            var page = this.get('currentPage');
            if (page > 1) {
                this.send('findResults', query, page - 1);
            }
        }
    }
});
