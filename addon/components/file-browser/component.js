import Ember from 'ember';
import layout from './template';

/*
 * {{file-browser rootItems=items openFile=(action) openNode=(action)}}
 * or:
 * {{file-browser rootItem=item openFile=(action) openNode=(action)}}
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-browser'],
    itemWidth: 300,
    itemHeight: 30,

    rootItem: null,
    rootItems: null,

    currentParent: null,
    items: Ember.computed('currentParent', 'currentParent.childItems.[]',
                          'rootItems.[]', function() {
        let parent = this.get('currentParent');
        if (parent) {
            return this.get('currentParent.childItems');
        } else {
            return this.get('rootItems');
        }
    }),

    selectedItems: Ember.A(),
    breadcrumbs: Ember.A(),

    init() {
        this._super(...arguments);
        this.set('selectedItems', Ember.A());
        this.set('breadcrumbs', Ember.A());
    },

    didReceiveAttrs() {
        this._super(...arguments);
        const rootItem = this.get('rootItem');
        if (rootItem && !this.get('rootItems')) {
            this.set('currentParent', rootItem);
        }
    },

    actions: {
        selectItem(item) {
            this.get('selectedItems').addObject(item);
        },

        navigateToItem(item) {
            let breadcrumbs = this.get('breadcrumbs');
            let index = breadcrumbs.indexOf(item);
            if (index === -1) {
                breadcrumbs.pushObject(item);
            } else {
                let slicedBread = breadcrumbs.slice(0, index + 1);
                this.set('breadcrumbs', slicedBread);
            }
            this.set('currentParent', item);
        },

        openItem(item) {
            if (item.get('isFile')) {
                if (this.get('openFile')) {
                    this.sendAction('openFile', item);
                }
            } else if (item.get('isNode')) {
                if (this.get('openFile')) {
                    this.sendAction('openNode', item);
                }
            } else if (item.get('isFolder')) {
                this.send('navigateToItem', item);
            }
        },

        back() {
            this.get('breadcrumbs').popObject();
            let newParent = this.get('breadcrumbs.lastObject') || this.get('rootItem');
            this.set('currentParent', newParent);
        },
    }
});
