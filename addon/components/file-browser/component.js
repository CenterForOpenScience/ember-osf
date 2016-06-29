import Ember from 'ember';
import layout from './template';

/*
 * Wrapper for file items. Includes state for the item's row.
 */
let ItemWrapper = Ember.ObjectProxy.extend({
    isSelected: false,

});

/*
 * {{file-browser rootItem=item openFile=(action 'openFile') openNode=(action 'openNode')}}
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-browser'],

    // TODO: set itemWidth on container resize
    itemWidth: 500,
    itemHeight: 30,

    breadcrumbs: null,

    rootItem: Ember.computed('breadcrumbs.[]', {
        get() {
            return this.get('breadcrumbs.firstObject');
        },
        set(_, item) {
            let wrappedItem = ItemWrapper.create({
                content: item
            });
            this.set('breadcrumbs', Ember.A([wrappedItem]));
        }
    }),
    atRoot: Ember.computed.equal('breadcrumbs.length', 1),
    currentParent: Ember.computed.readOnly('breadcrumbs.lastObject'),
    selectedItems: Ember.computed.filterBy('items', 'isSelected', true),

    items: Ember.computed('currentParent.files.[]', 'currentParent.children.[]', function() {
        let childItems = Ember.A();
        childItems.addObjects(this.get('currentParent.files') || []);
        childItems.addObjects(this.get('currentParent.children') || []);
        return childItems;
    }),

    actions: {
        selectItem(item) {
            item.set('isSelected', true);
            if (item.get('isFile') && this.get('selectFile')) {
                this.sendAction('selectFile', item);
            }
            if (item.get('isNode') && this.get('selectNode')) {
                this.sendAction('selectNode', item);
            }
        },

        openItem(item) {
            if (item.get('isFile') && this.get('openFile')) {
                this.sendAction('openFile', item);
            }
            if (item.get('isNode') && this.get('openNode')) {
                this.sendAction('openNode', item);
            }
            if (item.get('canHaveChildren')) {
                this.send('navigateToItem', item);
            }
        },

        navigateToItem(item) {
            let breadcrumbs = this.get('breadcrumbs');
            let index = breadcrumbs.indexOf(item);
            if (index === -1) {
                // TODO (Abram) Valid to assume item is a child of currentParent?
                breadcrumbs.pushObject(item);
            } else {
                let slicedBread = breadcrumbs.slice(0, index + 1);
                this.set('breadcrumbs', Ember.A(slicedBread));
            }
        }
    }
});
