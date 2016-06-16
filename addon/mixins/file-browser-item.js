import Ember from 'ember';

/**
 * A `file-browser` item could be a `node`, `file-provider`, or `file`/folder.
 * This mixin provides a consistent interface for `file-browser` to use.
 */
export default Ember.Mixin.create({
    itemName: Ember.computed.or('name', 'title'),
    isNode: Ember.computed.equal('constructor.modelName', 'node'),
    isProvider: Ember.computed.equal('constructor.modelName', 'file-provider'),
    isFolder: Ember.computed.and('_isFileModel', '_isFolder'),
    isFile: Ember.computed.and('_isFileModel', '_isFile'),
    canHaveChildren: Ember.computed.or('isNode', 'isProvider', 'isFolder'),

    _isFileModel: Ember.computed.equal('constructor.modelName', 'file'),
    _isFolder: Ember.computed.equal('kind', 'folder'),
    _isFile: Ember.computed.equal('kind', 'file'),

    // TODO: update childItems when `children` or `files` changes
    childItemsLoaded: false,
    childItems: Ember.computed('_childItems', function() {
        let childItems = this.get('_childItems');
        if (childItems === null) {
            loadChildItems(this);
            return Ember.A();
        }
        return childItems;
    }),
    _childItems: null,
});

function loadChildItems(item) {
    let promises = [
        item.get('files'),
        item.get('children')
    ];

    Ember.RSVP.allSettled(promises).then((results) => {
        let childItems = [];
        for (let r of results) {
            let array = r.value;
            if (array && array.length) {
                // These 'arrays' are only slightly array-like, so this is more
                // long-winded than usual.
                for (let i = 0; i < array.length; i++) {
                    let child = array.objectAt(i);
                    childItems.push(child);
                }
            }
        }
        item.set('_childItems', Ember.A(childItems));
        item.set('childItemsLoaded', true);
    });
};

