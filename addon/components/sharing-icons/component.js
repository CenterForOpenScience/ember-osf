import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';
import trunc from 'npm:unicode-byte-truncate';
import Analytics from '../../mixins/analytics';


/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display sharing icons
 *
 * Sample usage:
 * {{sharing-icons
 *     title=title
 *     description=result.description
 *     hyperlink=hyperlink
 *     facebookAppId: null // leave blank to not show facebook icon
 *     metricsExtra=result.id
 * }}
 * @class sharing-icons
 */
export default Ember.Component.extend(Analytics, {
    layout,
    i18n: Ember.inject.service(),
    host: config.OSF.url,
    title: null,
    description: null,
    hyperlink: null,
    facebookAppId: null,
    metricsExtra: null,
    twitterHref: Ember.computed(function() {
        const queryParams = {
            url: this.hyperlink,
            text: this.title,
            via: 'OSFramework'
        };
        return `https://twitter.com/intent/tweet?${Ember.$.param(queryParams)}`;
    }),
    /* TODO: Update this with new Facebook Share Dialog, but an App ID is required
     * https://developers.facebook.com/docs/sharing/reference/share-dialog
     */
    facebookHref: Ember.computed(function() {
        if(!this.facebookAppId) {
            return null;
        }
        const queryParams = {
            app_id: this.facebookAppId,
            display: 'popup',
            href: this.hyperlink,
            redirect_uri: this.hyperlink
        };
        return `https://www.facebook.com/dialog/share?${Ember.$.param(queryParams)}`;
    }),
    // https://developer.linkedin.com/docs/share-on-linkedin
    linkedinHref: Ember.computed(function() {
        const url = encodeURIComponent(this.hyperlink || '').slice(0, 1024);
        const queryParams = {
            mini: 'true',                                 // required, maxLength: 4
            title: trunc(this.title || '', 200),          // optional
            summary: trunc(this.description || '', 256),  // optional
            source: 'OSF',                                // optional, maxLength: 200
        };
        return `https://www.linkedin.com/shareArticle?url=${url}&${Ember.$.param(queryParams)}`;
    }),
    emailHref: Ember.computed(function() {
        const queryParams = {
            subject: this.title,
            body: this.hyperlink,
        };
        return `mailto:?${Ember.$.param(queryParams)}`;
    }),

    actions: {
        shareLink(href, category, action, label, extra) {
            const metrics = Ember.get(this, 'metrics');

            // TODO submit PR to ember-metrics for a trackSocial function for Google Analytics. For now, we'll use trackEvent.
            metrics.trackEvent({
                category,
                action,
                label,
                extra
            });

            if (label.includes('email'))
               return;

            window.open(href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,width=600,height=400');
            return false;
        },
    }
});
