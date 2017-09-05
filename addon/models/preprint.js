import DS from 'ember-data';
import OsfModel from './osf-model';

/**
 * @module ember-osf
 * @submodule models
 */

/**
 * Model for OSF APIv2 preprints. This model may be used with one of several API endpoints. It may be queried directly,
 *  or accessed via relationship fields.
 * For field and usage information, see:
 * https://api.osf.io/v2/docs/#!/v2/Preprint_List_GET
 * https://api.osf.io/v2/docs/#!/v2/Preprint_Detail_GET
 * https://api.osf.io/v2/docs/#!/v2/User_Preprints_GET
 * @class Preprint
 */
export default OsfModel.extend({

    title: DS.attr('fixstring'),
    // TODO: May be a relationship in the future pending APIv2 changes
    subjects: DS.attr(),
    dateCreated: DS.attr('date'),
    datePublished: DS.attr('date'),
    dateModified: DS.attr('date'),
    doi: DS.attr('fixstring'),
    isPublished: DS.attr('boolean'),
    isPreprintOrphan: DS.attr('boolean'),
    licenseRecord: DS.attr(),
    reviewsState: DS.attr('string'),

    // Relationships
    node: DS.belongsTo('node', { inverse: null, async: true }),
    license: DS.belongsTo('license', { inverse: null }),
    primaryFile: DS.belongsTo('file', { inverse: null }),
    provider: DS.belongsTo('preprint-provider', { inverse: 'preprints', async: true }),
    reviewLogs: DS.hasMany('review-log', { inverse: 'reviewable', async: true }),
    contributors: DS.hasMany('contributors', { async: true }),
});
