import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Allow the user to view and manage tags.
 * See TaggableMixin for controller actions that can be used with this component.
 * ```javascript
 * {{tags-widget
 *   addATag=(action 'addATag')
 *   removeATag=(action 'removeATag')
 *   tags=model.tags}}
 * ```
 * @class tags-widget
 */
export default Ember.Component.extend({
    layout,
    newTag: null,
    tags: [],
    actions: {
        addATag(tag) {
            let res = this.attrs.addATag(tag);
            res.then(() => this.set('newTag', ''));
        },
        removeATag(tag) {
            this.sendAction('removeATag', tag);
        }
    }
});
