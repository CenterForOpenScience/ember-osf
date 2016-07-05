import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the correct file tree icon for on the item to be displayed
 *
 * Sample usage:
 * ```javascript
 * {{file-browser-icon
 * item=item}}
 * ```
 * @class file-browser-icon
 */
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
    })
});
