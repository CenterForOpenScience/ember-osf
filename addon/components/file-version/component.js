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
 * ```javascript
 * {{file-version
 * version=version
 * download='download'}}
 * ```
 * @class file-version
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-version'],
    tagName: 'tr',

    actions: {
        downloadVersion(version) {
            this.sendAction('download', version);
        }
    }
});
