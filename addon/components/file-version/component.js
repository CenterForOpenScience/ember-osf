import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display information about one revision of a file
 *
 * Sample usage:
 * ```handlebars
 * {{file-version
 * version=version
 * download='download'
 * clickable=true}}
 * ```
 * @class file-version
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-version'],
    tagName: 'tr',
    clickable: false,

    actions: {
        downloadVersion(version) {
            this.sendAction('download', version);
        }
    }
});
