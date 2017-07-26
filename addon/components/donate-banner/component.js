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

        let currentDate = new Date();

        let changeDates = this.get('changeDates');

        for (let x = changeDates.length - 2; x >= 0; x--) {
            if (currentDate >= changeDates[x].date
                    && !(currentDate > changeDates[5].date)) {

                this.set('bannerBackground', 'banner-' + x);
                this.set('bannerText', changeDates[x].text);
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
    bannerText: '',

    changeDates: Ember.A([
        {
            'date': new Date('July 27, 2017'),
            'text': 'The Center for Open Science (COS) created the OSF and ' +
                    'a suite of of free products to advance the work of ' +
                    'the research community. If you value these tools, ' +
                    'please make a gift to support COS’s efforts to improve ' +
                    'and scale these services. '
        },
        {
            'date': new Date('August 3, 2017'),
            'text': 'Thousands of researchers, use the OSF and its related ' +
                    'services daily. If you value the OSF, make a donation ' +
                    'to support the Center for Open Science and its ongoing ' +
                    'efforts to improve and advance these public goods. '
        },
        {
            'date': new Date('August 10, 2017'),
            'text': 'The Center for Open Science (COS) created the OSF and ' +
                    'its related services as public goods. While these ' +
                    'services will always be free to use they are not free ' +
                    'to build, improve and maintain. Please support the OSF ' +
                    'and COS with a donation today. '
        },
        {
            'date': new Date('August 17, 2017'),
            'text': 'The Center for Open Science launched the OSF with the ' +
                    'goal of creating a service where the entire research ' +
                    'cycle is supported and barriers to accessing data are ' +
                    'removed. Support COS’s efforts to advance the work of ' +
                    'researchers with a gift today! '
        },
        {
            'date': new Date('August 24, 2017'),
            'text': 'At the Center for Open Science (COS), we envision a ' +
                    'future in which ideas, processes, and outcomes of ' +
                    'research are free and open to all. COS relies on ' +
                    'contributions to build the free products you use and ' +
                    'love. Help make the vision a reality with a gift today. '
        },
        {
            'date': new Date('August 31, 2017')
        }
    ]),
});
