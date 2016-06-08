import Ember from 'ember';
import layout from './template';
import Table from 'ember-light-table';

/**
 * A row could represent a node, file-provider, or file, each of which has a
 * different interface. RowProxy provides a consistent interface for everything
 * the file browser needs to know.
 */
let RowProxy = Ember.ObjectProxy.extend({
    allChildren: Ember.computed('files', 'children', function() {
        return new Ember.RSVP.Promise((resolve, reject) => {
            let promises = [this.get('files'), this.get('children')];
            Ember.RSVP.allSettled(promises).then((results) => {
                let children = Ember.A();
                for (let r of results) {
                    let childList = r.value;
                    if (childList && childList.length) {
                        for (let i = 0; i < childList.length; i++) {
                            let child = childList.objectAt(i);
                            children.push(wrapRow(child));
                        }
                    }
                }
                resolve(children);
            });
        });
    }),

    isExpandable: Ember.computed('isFolder', 'children', function() {
        return this.get('isFolder') || !!this.get('children');
    }),

    name: Ember.computed('content.name', 'content.title', function() {
        return this.get('content.name') || this.get('content.title');
    })
});

function wrapRow(row) {
    if (row instanceof RowProxy) {
        return row;
    }
    return RowProxy.create({ content: row });
}

export default Ember.Component.extend({
    layout,
    table: null,
    isLoading: true,
    showHeader: true,
    sort: null,

    init() {
        this._super(...arguments);
        this.set('root', wrapRow(this.get('root')));

        this.set('table', new Table(this.get('columns')));
        this.get('root.allChildren').then((children) => {
            this.table.setRows(children);
            this.set('isLoading', false);
        });
    },

    /*
    filesChanged: Ember.observer('files.[]', function() {
        this.table.setRows(this.get('files'));
    }),
    */
    columns: Ember.computed(function() {
        return [{
            sortable: false,
            align: 'right',
            cellComponent: 'file-browser-expand-cell',
            width: 20
        }, {
            label: 'Name',
            valuePath: 'name'
        }];
    }),

    actions: {
        onColumnClick(column) {
            if (column.sorted) {
                this.set('sort', column);
            }
        }
    },

    sortChanged: Ember.observer('sort.valuePath', 'sort.ascending', function() {
        let key = this.get('sort.valuePath');
        if (!key) {
            return;
        }
        let asc = this.get('sort.ascending');
        let rows = this.get('table.rows');
        rows.sort((a, b) => {
            if (!asc) {
                [a, b] = [b, a];
            }
            let lhs = a.get(key);
            let rhs = b.get(key);
            if (typeof lhs === 'number' && typeof rhs === 'number') {
                return lhs - rhs;
            }
            if (lhs < rhs) {
                return -1;
            } else if (lhs > rhs) {
                return 1;
            } else {
                return 0;
            }
        });
        this.get('table').setRows(rows);
    }),
});
