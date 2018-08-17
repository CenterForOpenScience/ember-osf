import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';
import Analytics from '../../mixins/analytics';
/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display a share icon that pops out sharing options
 * @class sharing-icons-popover
 *
 * Sample usage:
 * {{sharing-icons
 *     title=title
 *     description=description
 *     hyperlink=hyperlink
 *     metricsExtra=metricsExtra
 * }}
 */
export default Ember.Component.extend(Analytics, {
    layout,
    i18n: Ember.inject.service(),

    host: config.OSF.url,
    isOpen: false,
    showSearch: false,
    title: null,
    description: null,
    hyperlink: null,
    facebookAppId: null,
    metricsExtra: null,
    actions: {
        clickSharePopover(extra) {
            const metrics = Ember.get(this, 'metrics');
            // TODO submit PR to ember-metrics for a trackSocial function for Google Analytics. For now, we'll use trackEvent.
            metrics.trackEvent({
                category: 'button',
                action: 'click',
                label: 'Discover - Sharing Popover',
                extra: extra
            });
        },
    }});
