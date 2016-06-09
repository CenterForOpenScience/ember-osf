import Ember from 'ember';
import layout from './template';

/**
 * A row could represent a node, file-provider, or file, each of which has a
 * different interface. RowProxy provides a consistent interface for everything
 * the file browser needs to know.
 */
let RowProxy = Ember.ObjectProxy.extend({
    isLoading: false,
    expanded: false,
    childTrees: Ember.A(),

    loadChildren() {
        this.set('isLoading', true);
        let promises = [
            this.get('content.files'),
            this.get('content.children')
        ];
        Ember.RSVP.allSettled(promises).then((results) => {
            let childTrees = Ember.A();
            for (let r of results) {
                let childList = r.value;
                if (childList && childList.length) {
                    for (let i = 0; i < childList.length; i++) {
                        let child = childList.objectAt(i);
                        childTrees.pushObject(child);
                    }
                }
            }
            this.set('isLoading', false);
            this.set('childTrees', childTrees);
        });
    },

    isNode: Ember.computed('content.constructor.modelName', function() {
        let modelName = this.get('content.constructor.modelName');
        return modelName === 'node';
    }),

    isExpandable: Ember.computed('isFolder', 'isNode', function() {
        return this.get('isFolder') || this.get('isNode');
    }),

    name: Ember.computed('content.name', 'content.title', function() {
        return this.get('content.name') || this.get('content.title');
    })
});

export default Ember.Component.extend({
    layout,
    //tagName: 'tbody',
    expanded: false,

    row: Ember.computed('root', function() {
        let row = RowProxy.create({ content: this.get('root') });
        row.loadChildren();
        row.set('expanded', this.get('expanded'));
        return row;
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
