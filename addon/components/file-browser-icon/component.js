import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    tagName: 'span',

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
});
