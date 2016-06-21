import Ember from 'ember';
import layout from './template';

/**
 * A row could represent a node, file-provider, or file, each of which has a
 * different interface. RowProxy provides a consistent interface for everything
 * the file browser needs to know.
 *
 * Important: Use `row.content` when passing a row model outside file-browser
 */
let RowProxy = Ember.ObjectProxy.extend({
    selected: false,
    expanded: false,
    isLoading: false,
    name: Ember.computed.or('content.name', 'content.title'),
    isExpandable: Ember.computed.or('isFolder', 'isNode'),
    isNode: Ember.computed.equal('content.constructor.modelName', 'node'),
    isLinkable: Ember.computed.or('isNode', 'isFile'),

    childTrees: null,

    /**
     * Load all this row's children. Concatenates `content.files` (if it exists)
     * with `content.children` (if it exists) and puts the result in
     * `childTrees`.
     *
     * Has about the same result as:
     * `childTrees: Ember.computed.union('content.files', 'content.children')`
     * but it sets `isLoading` to `true` when it starts and to `false` when it's
     * done. Computed properties don't expose the underlying promises, and a
     * loading indicator seems important.
     *
     * TODO: But this counters ember's binding magic... If the file/node models
     * change, the tree won't automatically update. Could add another observer
     * on `files` and `children`, but it would be nice to find another way to
     * update `isLoading` and get rid of this method entirely
     */
    loadChildTrees() {
        this.set('isLoading', true);
        let promises = [
            this.get('content.files'),
            this.get('content.children')
        ];
        Ember.RSVP.allSettled(promises).then((results) => {
            let childTrees = Ember.A();
            for (let r of results) {
                let array = r.value;
                if (array && array.length) {
                    for (let i = 0; i < array.length; i++) {
                        let child = array.objectAt(i);
                        childTrees.pushObject(child);
                    }
                }
            }
            this.set('childTrees', childTrees);
            this.set('isLoading', false);
        });
    }
});

export default Ember.Component.extend({
    layout,
    tagName: 'tbody',
    expanded: Ember.computed.alias('row.expanded'),

    nextSelectedPath: Ember.computed('selectedPath', function() {
        let selectedPath = this.get('selectedPath');
        return selectedPath ? selectedPath.slice(1) : null;
    }),

    row: Ember.computed('root', 'selectedPath', function() {
        let row = RowProxy.create({ content: this.get('root') });
        let selectedPath = this.get('selectedPath');
        if (selectedPath && selectedPath.length) {
            if (row.get('name') === selectedPath[0]) {
                row.set('expanded', true);
                if (selectedPath.length === 1) {
                    row.set('selected', true);
                }
            }
        }
        return row;
    }),

    // This observer is part of the loadChildTrees hack in RowProxy
    expandedChanged: Ember.on('init', Ember.observer('expanded', function() {
        if (this.get('expanded')) {
            this.get('row').loadChildTrees();
        }
    })),

    actions: {
        clickRow(row) {
            let action = null;
            if (row.get('isFile') || row.get('isFolder')) {
                action = this.get('onClickFile');
            } else if (row.get('isNode')) {
                action = this.get('onClickNode');
            }
            if (action) {
                action(row.content);
            }
        }
    }
});
