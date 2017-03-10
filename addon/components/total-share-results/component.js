import Ember from 'ember';
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
    layout
});
