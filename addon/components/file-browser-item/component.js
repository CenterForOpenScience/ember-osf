import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    classNames: ['file-browser-item'],

    click() {
        this.sendAction('selectItem', this.get('item'));
    },

    doubleClick() {
        let item = this.get('item');
        if (item.get('canHaveChildren')) {
            this.sendAction('navigateToItem', item);
        } else {
            this.sendAction('openItem', item);
        }
    },

    actions: {
        open() {
            this.sendAction('openItem', this.get('item'));
        }
    }
});
