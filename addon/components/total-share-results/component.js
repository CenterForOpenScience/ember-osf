import Ember from 'ember';
import config from 'ember-get-config';
import layout from './template';

/**
 * Adapted from Registries - displays total search results
 *
 * ```handlebars
 *  {{total-share-results
 *      shareTotal=shareTotal
 *      shareTotalText=shareTotalText
 * }}
 * ```
 * @class search-result
 */
export default Ember.Component.extend({
    layout,
    theme: Ember.inject.service(),
    shareTotal: null,
    consumingService: null,
    resourceType: Ember.computed('consumingService', function() {
        const consumingService = this.get('consumingService');
        const serviceMap = {
            preprints: 'preprint',
            registries: 'registration'
        };
        if (consumingService) {
            return serviceMap[consumingService] || null;
        } else {
            return consumingService;
        }
    }),
    init() {
        // Fetch total number of preprints. Allow elasticsearch failure to pass silently.
        // This is considered to be a one-time fetch, and therefore is run in controller init.
        this._super(...arguments);
        const filter = [
            {
                term: {
                    types: this.get('resourceType')
                }
            }
        ];

        const getTotalPayload = {
            size: 0,
            from: 0,
            query: {
                bool: {
                    must: {
                        query_string: {
                            query: '*'
                        }
                    },
                    filter
                }
            }
        };

        if (this.get('theme.isProvider')) {
            filter.push({
                term: {
                    // TODO filter by name and use sources.raw (potential conflicts later), Needs API name to match SHARE source.
                    // Update: .raw has been removed from type and source queries.
                    sources: this.get('theme.id')
                }
            });
        }
        Ember.$.ajax({
            type: 'POST',
            url: config.SHARE.searchUrl,
            data: JSON.stringify(getTotalPayload),
            contentType: 'application/json',
            crossDomain: true,
        })
          .then(results => this.set('shareTotal', results.hits.total));

        this.set('currentDate', new Date());
    },
});
