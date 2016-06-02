import Ember from 'ember';
import layout from './template';
import Table from 'ember-light-table';

export default Ember.Component.extend({
    layout,
    table: null,
    isLoading: true,

    init() {
        this._super(...arguments);
        this.set('table', new Table(this.get('columns')));
        this.get('files').then((files) => {
            this.set('isLoading', false);
            this.table.setRows(this.get('files'));
        });
    },

    nextIndent: Ember.computed('indent', function() {
        let indent = this.get('indent') || 0;
        return indent + 20;
    });

    indent: Ember.computed('columns', function() {
        let columns = this.get('columns');
        // TODO: no magic numbers
        return columns[0].width + 20;
    }),

    indentedColumns: Ember.computed('indent', function() {
        let columns = Ember.$.extend(true, [], this.get('columns'));
        columns[0].width = this.get('indent');
        return columns;
    }),

    /*
    filesChanged: Ember.observer('files.[]', function() {
        this.table.setRows(this.get('files'));
    }),
    */
    columns: Ember.computed(function() {
        return [{
            sortable: false,
            align: 'right',
            width: 20,
            cellComponent: 'file-browser-expand-cell'
        }, {
            label: 'Name',
            valuePath: 'name',
        }, {
            label: 'Size',
            valuePath: 'size',
            width: 100
        }, {
            label: 'Modified',
            valuePath: 'dateModified',
            width: 200,
            format: function(date) {
                if (date) {
                    let now = new Date();
                    if (date.toDateString() === now.toDateString()) {
                        return date.toTimeString();
                    }
                    return date.toDateString();
                }
            }
        }];
    })
});
