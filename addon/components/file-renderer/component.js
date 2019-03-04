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

    didRender() {
        this._super(...arguments);

        if (this.get('allowCommenting')) {
            Ember.$('iframe').on('load', function() {
                Ember.$('iframe')[0].contentWindow.postMessage('startHypothesis', config.OSF.mfrUrl);
            });
        }
    },
});
