import Ember from 'ember';
import layout from './template';

/**
 * A row could represent a node, file-provider, or file, each of which has a
 * different interface. RowProxy provides a consistent interface for everything
 * the file browser needs to know.
 */
let RowProxy = Ember.ObjectProxy.extend({
    isLoading: true,
    expanded: false,
    childTrees: Ember.computed.union('content.files', 'content.children'),
    isNode: Ember.computed.equal('content.constructor.modelName', 'node'),
    isExpandable: Ember.computed.or('isFolder', 'isNode'),
    name: Ember.computed.or('content.name', 'content.title')
});

export default Ember.Component.extend({
    layout,
    tagName: 'tbody',
    expanded: false,

    row: Ember.computed('root', function() {
        let row = RowProxy.create({ content: this.get('root') });
        row.set('expanded', this.get('expanded'));
        return row;
    }),

    childTreesChanged: Ember.observer('row.childTrees', function() {
        this.set('row.isLoading', false);
    }),

    actions: {
        clickRow(row) {
            let action = null;
            if (row.get('isFile') || row.get('isFolder')) {
                action = this.get('onClickFile');
            } else if (row.get('isNode')) {
                action = this.get('onClickNode');
            } 
            if (action) {
                action(row);
            }
        }
    }
});
