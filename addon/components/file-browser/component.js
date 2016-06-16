import Ember from 'ember';
import layout from './template';

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
        set(_, value) {
            this.set('breadcrumbs', Ember.A([value]));
        }
    }),
    currentParent: Ember.computed.alias('breadcrumbs.lastObject'),
    itemsLoaded: Ember.computed.alias('currentParent.childItemsLoaded'),
    items: Ember.computed.alias('currentParent.childItems'),
    atRoot: Ember.computed.equal('breadcrumbs.length', 1),

    selectedItems: Ember.A(),

    actions: {
        selectItem(item) {
            this.get('selectedItems').addObject(item);
        },

        navigateToItem(item) {
            let breadcrumbs = this.get('breadcrumbs');
            let index = breadcrumbs.indexOf(item);
            if (index === -1) {
                // TODO: This assumes item is a child of currentParent
                breadcrumbs.pushObject(item);
            } else {
                let slicedBread = breadcrumbs.slice(0, index + 1);
                this.set('breadcrumbs', Ember.A(slicedBread));
            }
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
            } else if (item.get('canHaveChildren')) {
                this.send('navigateToItem', item);
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
