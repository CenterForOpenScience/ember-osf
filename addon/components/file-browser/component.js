import Ember from 'ember';
import layout from './template';

/* use:
 * {{file-browser rootItems=items selectedFile=file
 *   openFile=(action) openNode=(action)}}
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

    didReceiveAttrs() {
        this._super(...arguments);
        const rootItem = this.get('rootItem');
        if (rootItem && !this.get('rootItems')) {
            this.set('currentParent', rootItem);
        }
    },

    actions: {
        select(item) {
            this.get('selectedItems').addObject(item);
        },

        open(item) {
            if (item.get('canHaveChildren')) {
                this.get('breadcrumbs').pushObject(item);
                this.set('currentParent', item);
            } else {
                this.sendAction('openFile', item);
            }
        },

        back() {
            this.get('breadcrumbs').popObject();
            this.set('items', this.get('breadcrumbs.lastObject.childItems'));
        },

        gotoBreadcrumb(item) {

        }
    }

    /*
    selectedPath: Ember.computed('selectedFile', function() {
        let file = this.get('selectedFile');
        if (!file) {
            return null;
        }
        let pathArray = this.get('selectedFile.materializedPath').split('/');
        pathArray = pathArray.filter((name) => name !== '');
        pathArray.unshift(file.get('provider'));
        pathArray.unshift(this.get('rootNode.title'));
        return Ember.A(pathArray);
    }),
    */
});
