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
            'date': new Date(2017, 10, 29)
        }
    ]),
});
