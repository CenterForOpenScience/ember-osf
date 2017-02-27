import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 GUIDs.
 *
 * For usage information, see the page for a specific GUID entry:
 *  https://api.osf.io/v2/guids/<guid>?resolve
 *
 * By design, this adapter forces every request to resolve to the final destination guid (by appending a query
 *   parameter) Since the user does not know what type of record the GUID is, we explicitly do not support custom
 *   query parameters- only findRecord requests are officially supported.
 *
 * Since every request will resolve to an actual record, there is no accompanying serializer for the "GUID" type
 *   (and this model is only a placeholder to make ember-data work). Ember-data will automatically choose the correct
 *   serializer based on the payload "type" field, and serialize a record to match.
 *
 * @class Guid
 * @extends OsfModel
 */
export default OsfModel.extend({
});
