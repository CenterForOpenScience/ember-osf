import Ember from 'ember';
import layout from './template';
import Table from 'ember-light-table';

export default Ember.Component.extend({
    layout,
    table: null,
    isLoading: true,

    init() {
        this._super(...arguments);
        this.set('table', new Table(this.get('indentedColumns')));
        this.get('files').then(() => {
            this.set('isLoading', false);
        });
    },

    indentedColumns: Ember.computed('columns', function() {
        // TODO: clean this up
        let columns = Ember.$.extend(true, [], this.get('columns'));
        columns[0].width += 20;
        return columns;
    }),

    filesChanged: Ember.observer('files.[]', function() {
        this.table.setRows(this.get('files'));
    }),
});
