import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the current banner.
 *
 * Sample usage:
 * ```handlebars
 * {{scheduled-banner}}
 * ```
 *
 * @class scheduled-banner
 */
export default Ember.Component.extend({

    layout,
    toast: Ember.inject.service(),
    attributeBindings: [
        'style',
        'hidden',
    ],

    color: '',
    defaultAltText: '',
    mobileAltText: '',
    defaultPhoto: null,
    mobilePhoto: null,
    startDate: null,
    endDate: null,
    hidden: true,

    colorStyle: Ember.computed('defaultPhoto', function() {
        const bgColor = this.get('color');
        return Ember.String.htmlSafe(`background-color: ${bgColor}`);
    }),

    defaultStyle: Ember.computed('defaultPhoto', function() {
        const defaultPhotoUrl = this.get('defaultPhoto');
        return Ember.String.htmlSafe(`background: url(${defaultPhotoUrl}) no-repeat center top`);
    }),

    mobileStyle: Ember.computed('mobilePhoto', function() {
        const mobilePhotoUrl = this.get('mobilePhoto');
        return Ember.String.htmlSafe(`background: url(${mobilePhotoUrl}) no-repeat center top`);
    }),

    init() {
        this._super(...arguments);

        Ember.$.ajax({
            url: `${config.OSF.apiUrl}/_/banners/current`,
            crossDomain: true
        })
            .then(({data: { attributes: attrs, links}}) => {
                this.setProperties({
                    color: attrs.color,
                    defaultAltText: attrs.default_alt_text,
                    mobileAltText: attrs.mobile_alt_text,
                    defaultPhoto: links.default_photo,
                    mobilePhoto: links.mobile_photo,
                    startDate: attrs.start_date,
                });
                this.get('startDate') && this.set('hidden', false);
            })

            .fail(() => {
                this.get('toast', 'Unable to load the current banner.');
            });
    },
});
