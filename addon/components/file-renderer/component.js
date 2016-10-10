import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Render the provided url in an iframe via MFR
 *
 * Sample usage:
 * ```handlebars
 * {{file-renderer
 *   download=model.links.download
 *     width="800" height="1000" allowfullscreen=true}}
 * ```
 * @class file-renderer
 */
export default Ember.Component.extend({
    layout,
    download: null,
    version: null,
    width: '100%',
    height: '100%',
    allowfullscreen: true,
    mfrUrl: Ember.computed('download', 'version', function() {
        const base = config.OSF.renderUrl;
        const download = this.get('download');
        const version = this.get('version') ? `&version=${this.get('version')}` : '';
        const url = encodeURIComponent(`${download}?direct&mode=render&initialWidth=766${version}`);

        return `${base}?url=${url}`;
    })
});
