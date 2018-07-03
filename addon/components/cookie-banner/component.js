import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

 /**
 * Adds a cookie banner to the page
 *
 * Sample usage:
 * ```handlebars
 * {{cookie-banner
 *   addCookie=(action 'addCookie')
 * }}
 * ```
 *
 * @class dropzone-widget
 */
export default Ember.Component.extend({
    layout,

    actions: {
        addCookie() {
            this.addCookie();
        }
    }
});
