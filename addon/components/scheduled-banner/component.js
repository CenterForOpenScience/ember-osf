import Ember from 'ember';
import layout from './template';
import config from 'ember-get-config';
import computedStyle from 'ember-computed-style';
import Analytics from '../../mixins/analytics';

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
export default Ember.Component.extend(Analytics, {

    layout,
    toast: Ember.inject.service(),

    classNames: ['banner'],
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
    link: '',
    name: '',

    colorStyle: computedStyle('colorProperty'),
    colorProperty: Ember.computed('color', function() {
        const bgColor = this.get('color');
        return { 'background-color': `${bgColor}` };
    }),

    defaultStyle: computedStyle('bgProperty'),
    bgProperty: Ember.computed('defaultPhoto', function() {
        const defaultPhotoUrl = this.get('defaultPhoto');
        return { 'background': `url(${defaultPhotoUrl}) no-repeat center top` };
    }),

    mobileStyle: computedStyle('mobileBgProperty'),
    mobileBgProperty: Ember.computed('mobilePhoto', function() {
        const mobilePhotoUrl = this.get('mobilePhoto');
        return { 'background': `url(${mobilePhotoUrl}) no-repeat center top`};
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
                    link: attrs.link || 'https://www.crowdrise.com/centerforopenscience',
                    name: attrs.name,
                });
                this.get('startDate') && this.set('hidden', false);
            })
            .fail(() => {
                this.get('toast', 'Unable to load the current banner.');
            });
    },
});
