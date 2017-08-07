import Ember from 'ember';
import layout from './template';
import AnalyticsMixin from 'ember-osf/mixins/analytics';

/**
 * @module ember-osf
 * @submodule components
 */

/**
 * Display the donate banner.  Has an automated script to determine
 * what the banner should look like based on the the current date.
 *
 * Sample usage:
 * ```handlebars
 * {{donate-banner}}
 * ```
 *
 * @class donate-banner
 */
export default Ember.Component.extend(AnalyticsMixin, {

    init() {
        this._super();

        let currentDate = this.get('currentDate') ? this.get('currentDate') : new Date();

        let changeDates = this.get('changeDates');

        let endDate = changeDates.pop().date;

        for (let x = changeDates.length - 1; x >= 0; x--) {
            if (currentDate >= changeDates[x].date
                    && (currentDate < endDate)) {

                this.set('bannerBackground', 'banner-' + x);
                this.set('beforeText', changeDates[x].beforeText);
                this.set('afterText', changeDates[x].afterText);
                this.set('linkText', changeDates[x].linkText);
                this.set('style', 'display:""');
                break;

            } else {
                this.set('style', 'display:none');
            }
        }
    },

    layout,

    attributeBindings: ['style'],
    display: '',
    bannerBackground: '',
    beforeText: '',
    afterText: '',
    linkText: '',
    currentDate: null,

    changeDates: Ember.A([
        {
            'date': new Date(2017, 7, 7),
            'beforeText': 'The Center for Open Science (COS) created the OSF and ' +
                        'a suite of of free products to advance the work of ' +
                        'the research community. If you value these tools, ' +
                        'please make a gift to support COS’s efforts to improve ' +
                        'and scale these services. ',
            'afterText': '',
            'linkText': 'Donate Now!'
        },
        {
            'date': new Date(2017, 7, 14),
            'beforeText': 'Thousands of researchers use the OSF and its related ' +
                          'services daily. If you value the OSF, ',
            'afterText':  ' to support the Center for Open Science ' +
                          'and its ongoing efforts to improve and advance ' +
                          'these public goods. ',
            'linkText':   'make a donation'
        },
        {
            'date': new Date(2017, 7, 21),
            'beforeText': 'The Center for Open Science (COS) created the ' +
                          'OSF and its related services as public goods. ' +
                          'While these services will always be free to use ' +
                          'they are not free to build, improve and maintain. ',
            'afterText':  '',
            'linkText':   'Please support the OSF and COS with a donation today.'
        },
        {
            'date': new Date(2017, 7, 28),
            'beforeText': 'The Center for Open Science launched the ' +
                          'OSF with the goal of creating a service where ' +
                          'the entire research cycle is supported and ' +
                          'barriers to accessing data are removed. ',
            'afterText':  ' to advance the work of researchers with ' +
                          'a gift today!',
            'linkText':   "Support COS's efforts"
        },
        {
            'date': new Date(2017, 8, 4),
            'beforeText': 'At the Center for Open Science (COS), we ' +
                          'envision a future in which ideas, processes ' +
                          'and outcomes of research are free and open to ' +
                          'all. COS relies on contributions to build the ' +
                          'free products you use and love. Help make the ' +
                          'vision a reality with a ',
            'afterText': '',
            'linkText': 'gift today.'
        },
        {
            'date': new Date(2017, 8, 11)
        }
    ]),
});
