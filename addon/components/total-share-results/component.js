import Ember from 'ember';
import config from 'ember-get-config';
import layout from './template';
import hostAppName from '../../mixins/host-app-name';

/**
 * Adapted from Registries - displays total search results.  Currently can pull number of preprints, registries, or retractions
 * available for search, depending on consuming application. Otherwise, just returns number of all SHARE results.
 *
 * ```handlebars
 *  {{total-share-results
 * }}
 * ```
 * @class total-share-results
 */
const serviceMap = {
    Preprints: 'preprint',
    Registries: 'registration',
    'Retraction Watch': 'retraction'
};

export default Ember.Component.extend(hostAppName, {
    layout,
    i18n: Ember.inject.service(),
    theme: Ember.inject.service(),
    shareTotal: null,
    shareTotalText: Ember.computed(function() {
        // Returns description of results found: "searchable preprints", for example.
        const hostAppName = this.get('hostAppName');
        let item = null;
        if (hostAppName) {
            item = serviceMap[hostAppName] || null;
        }
        return `${this.get('i18n').t('eosf.components.totalShareResults.searchable')} ${item ? Ember.Inflector.inflector.pluralize(item) : this.get('i18n').t('eosf.components.totalShareResults.events')}`;
    }),
    resourceType: Ember.computed('hostAppName', function() {

        const hostAppName = this.get('hostAppName');
        if (hostAppName) {
            return serviceMap[hostAppName] || null;
        } else {
            return null;
        }
    }),
    init() {
        // Fetch total number of preprints. Allow elasticsearch failure to pass silently.
        // This is considered to be a one-time fetch, and therefore is run in controller init.
        this._super(...arguments);
        const filter = Ember.A();
        const resourceType = this.get('resourceType');
        if (resourceType) {
            filter.pushObject(
                {
                    term: {
                        types: resourceType
                    }
                }
        )}

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
            url: config.OSF.shareSearchUrl,
            data: JSON.stringify(getTotalPayload),
            contentType: 'application/json',
            crossDomain: true,
        })
          .then(results => this.set('shareTotal', results.hits.total));

        this.set('currentDate', new Date());
    },
});
