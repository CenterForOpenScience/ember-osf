import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';
import trunc from 'npm:unicode-byte-truncate'
import Analytics from '../../mixins/analytics';

function queryStringify(queryParams) {
    const query = [];

    // TODO set up ember to transpile Object.entries
    for (const param in queryParams) {
        let value = queryParams[param];
        let maxLength = null;

        if (Array.isArray(value)) {
            maxLength = value[1];
            value = value[0];
        }

        if (!value)
            continue;

        value = encodeURIComponent(value);

        if (maxLength)
            value = value.slice(0, maxLength);

        query.push(`${param}=${value}`);
    }

    return query.join('&');
}

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
    host: config.OSF.url,
    i18n: Ember.inject.service(),
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
        return `https://twitter.com/intent/tweet?${queryStringify(queryParams)}`;
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
        return `https://www.facebook.com/dialog/share?${queryStringify(queryParams)}`;
    }),
    // https://developer.linkedin.com/docs/share-on-linkedin
    linkedinHref: Ember.computed(function() {
        const queryParams = {
            url: [this.hyperlink, 1024],          // required
            mini: ['true', 4],                          // required
            title: trunc(this.title ? this.title : '', 200),      // optional
            summary: trunc(this.description ? this.description : '', 256), // optional
            source: ['Open Science Framework', 200]     // optional
        };
        return `https://www.linkedin.com/shareArticle?${queryStringify(queryParams)}`;
    }),
    emailHref: Ember.computed(function() {
        const queryParams = {
            subject: this.title,
            body: this.hyperlink
        };
        return `mailto:?${queryStringify(queryParams)}`;
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
