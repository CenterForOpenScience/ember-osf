import Ember from 'ember';
import layout from './template';

import loadAll from 'ember-osf/utils/load-relationship';

/*
 * Wrapper for file items. Includes state for the item's row.
 */
let FileItem = Ember.ObjectProxy.extend({
    isSelected: false,

    // TODO (Abram) update childItems when `children` or `files` changes
    // TODO (Abram) catch and display errors
    childItems: Ember.computed('_files.[]', '_children.[]', function() {
        let files = this._setupLoadAll('files', '_files', '_filesLoaded');
        let children = this._setupLoadAll('children', '_children', '_childrenLoaded');

        let wrappedItems = Ember.A();
        if (files) {
            wrappedItems.addObjects(files.map(wrapItem));
        }
        if (children) {
            wrappedItems.addObjects(children.map(wrapItem));
        }
        return wrappedItems;
    }),
    _files: null,
    _children: null,

    childItemsLoaded: Ember.computed.and('_filesLoaded', '_childrenLoaded'),
    _filesLoaded: false,
    _childrenLoaded: false,

    _setupLoadAll(relationship, destName, loaded) {
        let dest = this.get(destName);
        if (dest === null) {
            let model = this.get('content');
            if (relationship in model) {
                dest = this.set(destName, Ember.A());
                loadAll(model, relationship, dest).then(() => {
                    this.set(loaded, true);
                });
            } else {
                this.set(loaded, true);
            }
        }
        return dest;
    }
});

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
    items: Ember.computed.readOnly('currentParent.childItems'),
    itemsLoaded: Ember.computed.readOnly('currentParent.childItemsLoaded'),
    selectedItems: Ember.computed.filterBy('items', 'isSelected', true),

    loadedChanged: Ember.observer('itemsLoaded', function() {
        let containerWidth = this.$().width();
        this.set('itemWidth', containerWidth);
    }),

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


