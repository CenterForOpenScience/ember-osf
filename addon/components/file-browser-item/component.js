import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    classNames: ['file-browser-item'],

    selected: Ember.computed('selectedItems.[]', function() {
        // TODO: This would be better if selectedItems were a hash. Can Ember
        // observe when properties are added to or removed from an object?
        let selectedItems = this.get('selectedItems');
        let index = selectedItems.indexOf(this.get('item'));
        return index > -1;
    }),

    iconName: Ember.computed('item', 'item.expanded', function() {
        // TODO: More icons!
        if (this.get('item.isNode')) {
            // TODO node types
            return 'cube';
        }
        if (this.get('item.isProvider')) {
            // TODO provider-specific icons
            return 'hdd-o';
        }
        if (this.get('item.isFolder')) {
            return 'folder';
        }
        // TODO file types
        return 'file-o';
    }),

    click() {
        this.sendAction('selectItem', this.get('item'));
    },

    doubleClick() {
        this.sendAction('navigateToItem', this.get('item'));
    },

    actions: {
        open() {
            this.sendAction('openItem', this.get('item'));
        }
    }
});
