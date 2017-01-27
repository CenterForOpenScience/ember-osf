import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display copyright information as a footer
 * @class osf-copyright
 */
export default Ember.Component.extend({
    layout,
    currentYear: function() {
        let date = new Date();
        return date.getUTCFullYear().toString();
    }.property()
});
