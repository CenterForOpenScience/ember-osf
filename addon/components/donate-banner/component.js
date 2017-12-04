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

                this.set('altLg', changeDates[x].altLg);
                this.set('altSm', changeDates[x].altSm);
                this.set('largeClass', changeDates[x].largeClass);
                this.set('smallClass', changeDates[x].smallClass);
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
    alt: '',
    largeClass: '',
    smallClass: '',
    currentDate: null,

    changeDates: Ember.A([
        {
            'date': new Date(2017, 10, 20),
            'largeClass': 'wk-1-lg',
            'smallClass': 'wk-1-sm',
            'altLg': 'Things to look forward to: Thanksgiving Thursday, Black Friday, Cyber Monday, AND Giving Tuesday on ' +
            'Tuesday, November 28th. Please make a gift to support the OSF tools you use and love.',
            'altSm': 'Giving Tuesday is coming on Tuesday, November 28th. Please make a gift to support the OSF tools you ' +
            'use and love.',
        },
        {
            'date': new Date(2017, 10, 28),
            'largeClass': 'wk-2-lg',
            'smallClass': 'wk-2-sm',
            'altLg': 'Happy Giving Tuesday! Please make a gift to support the OSF tools you use and love.',
            'altSm': 'Happy Giving Tuesday! Please make a gift to support the OSF tools you use and love.',
        },
        {
            'date': new Date(2017, 10, 29),
            'largeClass': 'wk-3-lg',
            'smallClass': 'wk-3-sm',
            'altLg': "The Center for Open Science created the OSF and a suite of free products to advance " +
                     "the work of the research community. If you value these tools, please make a gift to " +
                     "support COS's efforts to improve and scale these services. DONATE NOW!",
            'altSm': "Support COS's efforts to improve free products and advance the work of the research community."
        },
        {
            'date': new Date(2017, 11, 6),
            'largeClass': 'wk-4-lg',
            'smallClass': 'wk-4-sm',
            'altLg': 'Thousands of researchers use the OSF and its related services daily. If you value the ' +
                     'OSF, make a donation to support the Center for Open Science and its ongoing efforts ' +
                     'to improve and advance these public goods.',
            'altSm': 'Thousands of researchers use the OSF and its related services. Make a donation to ' +
                     'support these ongoing efforts.'
        },
        {
            'date': new Date(2017, 11, 13),
            'largeClass': 'wk-5-lg',
            'smallClass': 'wk-5-sm',
            'altLg': 'The Center for Open Science created the OSF and its related services as public goods. ' +
                     'While these services will always be free to use, they are not free to build, maintain, ' +
                     'and improve. Please support the OSF and COS with a donation today.',
            'altSm': 'The OSF will always be free to use, but it is not free to build, maintain, and improve. Give a gift today.'
        },
        {
            'date': new Date(2017, 11, 20),
            'largeClass': 'wk-6-lg',
            'smallClass': 'wk-6-sm',
            'altLg': 'The Center for Open Science launched the OSF with the goal of creating a service to support ' +
                     'the entire research cycle and remove barriers to accessing data. Support COS’s efforts to advance' +
                     'the work of researchers with a gift today!',
            'altSm': 'The OSF will always be free to use, but it is not free to build, maintain, and improve. Give a gift today.'
        },
        {
            'date': new Date(2017, 11, 27),
            'largeClass': 'wk-7-lg',
            'smallClass': 'wk-7-sm',
            'altLg': 'At the Center for Open Science, we envision a future in which ideas, processes, and outcomes of ' +
                     'research are free and open. COS relies on contributions to build the free products you use and love. ' +
                     'Help make our vision a reality with a gift today. ',
            'altSm': 'The OSF will always be free to use, but it is not free to build, maintain, and improve. Give a gift today.'
        },
        {
            'date': new Date(2018, 0, 4),
        },
    ]),
});
