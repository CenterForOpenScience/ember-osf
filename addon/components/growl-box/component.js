import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Growl box, for app-wide growl-like error messages, needed
 * in an app-wide template or on the page wanted for service
 * growler to send messages.
 * ```handlebars
 * {{grow-box}}
 * ```
 * @class growl-box
 */
export default Ember.Component.extend({
    layout,
    growler: Ember.inject.service(),
    actions: {
        dismiss(growl) {
            growl.set('dismissed', true);
        }
    }
});
