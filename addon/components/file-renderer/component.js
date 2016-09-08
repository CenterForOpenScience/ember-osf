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
 *     width="800" height="1000"}}
 * ```
 * @class file-renderer
 */
export default Ember.Component.extend({
    layout,
    download: null,
    width: '100%',
    height: '100%',
    allowfullscreen: true,
    mfrUrl: Ember.computed('download', function() {
        var base = config.OSF.renderUrl;
        var download = this.get('download');
        var renderUrl = base + '?url=' + encodeURIComponent(download + '?direct&mode=render&initialWidth=766');
        return renderUrl;
    })
});
