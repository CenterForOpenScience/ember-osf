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
 *.  allowCommenting=provider.allowCommenting
 *   width="800" height="1000" allowfullscreen=true}}
 * ```
 * @class file-renderer
 */
export default Ember.Component.extend({
    layout,
    links: null,
    width: '100%',
    height: '100%',
    allowfullscreen: true,
    version: null,
    mfrUrl: Ember.computed('links.download', 'links.version', 'links.render', function() {
        if (this.get('links.render') != null) {
            return this.get('links.render')
        } else {
            let download = this.get('links.download');
            if (download.includes('?')) {
                download = download + '&mode=render';
            } else {
                download = download + '?direct&mode=render';
            }
            if (this.get('version')) {
                download += '&version=' + this.get('version');
            }
            const fallbackMfrRenderUrl = config.OSF.renderUrl + '?url=' + encodeURIComponent(download);
            return fallbackMfrRenderUrl;
        }
    }),
    mfrOrigin: Ember.computed('mfrUrl', function() {
        const urlParts = this.get('mfrUrl').split('/');
        if (urlParts.length < 3) {
            // if unable to extract mfr origin, just return config mfrUrl
            return config.OSF.mfrUrl;
        }
        return `${urlParts[0]}//${urlParts[2]}`;
    }),

    didRender() {
        this._super(...arguments);

        if (this.get('allowCommenting')) {
            Ember.$('iframe').on('load', () =>
                Ember.$('iframe')[0].contentWindow.postMessage('startHypothesis', this.get('mfrOrigin'))
            );
        }
    },
});
