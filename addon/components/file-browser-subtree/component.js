import Ember from 'ember';
import layout from './template';
import Table from 'ember-light-table';

export default Ember.Component.extend({
    layout,
    table: null,
    isLoading: true,
    indent: 20,

    init() {
        this._super(...arguments);
        this.set('table', new Table(this.get('indentedColumns')));
        this.get('row.files').then((files) => {
            this.table.setRows(files);
            this.set('isLoading', false);
        });
    },

    nextIndent: Ember.computed('indent', function() {
        return this.get('indent') + 20;
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
