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
    init() {
        this._super(...arguments);
        this.set('currentPath', `${window.location.origin}${window.location.pathname}`);
    },
    actions: {
        toggleHelpModal() {
            this.toggleProperty('isOpen');
        },
    }
});
