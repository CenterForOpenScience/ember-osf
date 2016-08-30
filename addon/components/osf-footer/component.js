import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the OSF footer
 * @class osf-footer
 */
export default Ember.Component.extend({
    layout,
    supportEmail: Ember.computed(function() {
        return '<n uers=\"znvygb:pbagnpg@bfs.vb\" ery=\"absbyybj\">Pbagnpg</n>'.replace(
            /[a-zA-Z]/g,
            function(e) {
                return String.fromCharCode((e <= 'Z' ? 90 : 122) >= (e = e.charCodeAt(0) + 13) ? e : e - 26);
            }
        );
    })
});
