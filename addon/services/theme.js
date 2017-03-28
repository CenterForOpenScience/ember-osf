import Ember from 'ember';

/**
 * @module ember-osf
 * @submodule services
 */

/**
 *
 * Stub so discover page can check for a theme.  Override on your consuming application.
 * @class theme
 * @extends Ember.Service
 */
export default Ember.Service.extend({
    /**
     * ID of provider
     * @property {string} id
     */
    id: null,
    /**
     * Should be computed property watching defaultProvider id.  Fetches provider from store.
     * @property {Object} provider
     */
    provider: null,
    /**
     * Should be computed property watching defaultProvider id.  Returns true if provider id and provider id is not 'OSF'
     * @property {boolean} isProvider
     */
    isProvider: null
});
