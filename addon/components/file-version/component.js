import Ember from 'ember';
import layout from './template';
import moment from 'moment';

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
 * currentVersion=currentVersion
 * versionUrl='versionUrl'}}
 * ```
 * @class file-version
 */
export default Ember.Component.extend({
    layout,
    classNames: ['file-version'],
    tagName: 'tr',
    
    clickable: Ember.computed('version', 'currentVersion', function() {
        return this.get('version.id') == this.get('currentVersion') ? false : true;
    }),

    dateFormatted: Ember.computed('version', function() {
        return moment(this.get('version.attributes.modified_utc')).format('YYYY-MM-DD h:mm A');
    }),

    actions: {
        downloadVersion(version) {
            this.sendAction('download', version);
        },
        changeVersion(version) {
            this.sendAction('versionChange', version);
        },
        copyMd5() {
            const id = '#md5-' + this.get('version.id');
            document.querySelector(id).select();
            document.execCommand('copy');
        },
        copySha256() {
            const id = '#sha256-' + this.get('version.id');
            document.querySelector(id).select();
            document.execCommand('copy');
        }
    }
});
