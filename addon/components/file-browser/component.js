import Ember from 'ember';
import layout from './template';
import Table from 'ember-light-table';

// {{file-browser node=node rootFolder=folder}}

export default Ember.Component.extend({
    layout,
    table: null,
    isLoading: true,

    init() {
        this._super(...arguments);
        this.set('table', new Table(this.get('columns')));
        this.get('node.files').then(() => {
            this.set('isLoading', false);
        });
    },

    filesChanged: Ember.observer('node.files.[]', function() {
        this.table.setRows(this.get('node.files'));
    }),

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
