import Ember from 'ember';
import layout from './template';

/*
 * Wrapper for file items. Includes state for the item's row.
 */
let FileItem = Ember.ObjectProxy.extend({
    isSelected: false,
    isCurrentParent: false,
    childItemsLoaded: false,

    // TODO: update childItems when `children` or `files` changes
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
                    childItems.push(wrapItem(child));
                }
            }
        }
        item.set('_childItems', Ember.A(childItems));
        item.set('childItemsLoaded', true);
    });
}

function wrapItem(item) {
    if (item instanceof FileItem) {
        return item;
    }
    return FileItem.create({
        content: item
    });
}

function unwrapItem(item) {
    if (item instanceof FileItem) {
        return item.get('content');
    }
    return item;
}

/*
 * {{file-browser rootItem=item openFile=(action 'openFile') openNode=(action 'openNode')}}
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-browser'],
    itemWidth: 300,
    itemHeight: 30,

    breadcrumbs: null,

    rootItem: Ember.computed('breadcrumbs.[]', {
        get() {
            return this.get('breadcrumbs.firstObject');
        },
        set(_, item) {
            let wrappedItem = wrapItem(item);
            this.set('breadcrumbs', Ember.A([wrappedItem]));
        }
    }),
    atRoot: Ember.computed.equal('breadcrumbs.length', 1),
    currentParent: Ember.computed.readOnly('breadcrumbs.lastObject'),
    itemsLoaded: Ember.computed.readOnly('currentParent.childItemsLoaded'),
    items: Ember.computed.readOnly('currentParent.childItems'),

    selectedItems: Ember.computed.filterBy('items', 'isSelected', true),

    actions: {
        selectItem(item) {
            item.set('isSelected', true);
            if (item.get('isFile') && this.get('selectFile')) {
                this.sendAction('selectFile', unwrapItem(item));
            }
            if (item.get('isNode') && this.get('selectNode')) {
                this.sendAction('selectNode', unwrapItem(item));
            }
        },

        openItem(item) {
            if (item.get('isFile') && this.get('openFile')) {
                this.sendAction('openFile', unwrapItem(item));
            }
            if (item.get('isNode') && this.get('openNode')) {
                this.sendAction('openNode', unwrapItem(item));
            }
            if (item.get('canHaveChildren')) {
                this.send('navigateToItem', item);
            }
        },

        navigateToItem(item) {
            let breadcrumbs = this.get('breadcrumbs');
            let index = breadcrumbs.indexOf(item);
            if (index === -1) {
                // TODO: Valid to assume item is a child of currentParent?
                breadcrumbs.pushObject(item);
            } else {
                let slicedBread = breadcrumbs.slice(0, index + 1);
                this.set('breadcrumbs', Ember.A(slicedBread));
            }
        },

        navigateUp() {
            let breadcrumbs = this.get('breadcrumbs');
            if (breadcrumbs.length === 1) {
                return;
            }
            breadcrumbs.popObject();
        }
    }
});


