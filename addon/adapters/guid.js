import OsfAdapter from './osf-adapter';

/**
 * Adapter for OSF APIv2 GUIDs.
 *
 * For usage information, see the page for a specific GUID entry:
 *  * https://api.osf.io/v2/guids/<guid>?resolve
 *
 * By design, this adapter forces every request to resolve to the final destination guid (by appending a query
 * parameter) Since the user does not know what type of record the GUID is, we explicitly do not support custom
 * query parameters- only findRecord requests are officially supported.
 *
 * Since every request will resolve to an actual record, there is no accompanying model/serializer. Ember-data will
 *   automatically choose the correct serializer based on the payload "type" field, and serialize a record to match.
 *
 * @class GuidAdapter
 */
export default OsfAdapter.extend({
    buildURL() {
        // Always force this request to resolve to dest resource
        const baseUrl = this._super(...arguments);
        return `${baseUrl}?resolve`;
    }
});
