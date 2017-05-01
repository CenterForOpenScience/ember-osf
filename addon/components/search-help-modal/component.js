import Ember from 'ember';
import layout from './template';

/**
 * Modal that provides examples and explanation of Lucene Search syntax
 *
 * ```handlebars
 * {{search-help-modal
 *      isOpen=isOpen
 * }}
 * ```
 * @class search-help-modal
 */
export default Ember.Component.extend({
    layout,
    isOpen: false,
    currentPath: Ember.computed(function() {
        return Ember.getOwner(this).lookup('controller:application').currentPath;
    }),
    actions: {
        close() {
            this.set('isOpen', false);
        },
        toggleHelpModal() {
            this.toggleProperty('isOpen');
        },
    }
});
