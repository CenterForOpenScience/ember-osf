import Ember from 'ember';
import DS from 'ember-data';
import OsfModel from './osf-model';
import ContributorMixin from 'ember-osf/mixins/contributor-mixin';

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
export default OsfModel.extend(ContributorMixin, {

    title: DS.attr('fixstring'),
    // TODO: May be a relationship in the future pending APIv2 changes
    subjects: DS.attr(),
    dateCreated: DS.attr('date'),
    datePublished: DS.attr('date'),
    originalPublicationDate: DS.attr('date'),
    dateModified: DS.attr('date'),
    doi: DS.attr('fixstring'),
    isPublished: DS.attr('boolean'),
    isPreprintOrphan: DS.attr('boolean'),
    licenseRecord: DS.attr(),
    reviewsState: DS.attr('string'),
    dateLastTransitioned: DS.attr('date'),
    preprintDoiCreated: DS.attr('date'),
    description: DS.attr('fixstring'),
    tags: DS.attr(),
    public: DS.attr('boolean'),
    /* Sloan fields */
    hasCoi: DS.attr('boolean'),
    hasDataLinks: DS.attr('string'),
    hasPreregLinks: DS.attr('string'),
    dataLinks: DS.attr(),
    preregLinkInfo: DS.attr('string'),
    preregLinks: DS.attr(),
    conflictOfInterestStatement: DS.attr('fixstring'),
    whyNoData: DS.attr('fixstring'),
    whyNoPrereg: DS.attr('fixstring'),
    // List of strings
    currentUserPermissions: DS.attr(),
    dateWithdrawn: DS.attr('date'),
    withdrawalJustification: DS.attr('fixstring'),

    // Relationships
    node: DS.belongsTo('node', { inverse: null, async: true }),
    license: DS.belongsTo('license', { inverse: null }),
    primaryFile: DS.belongsTo('file', { inverse: null }),
    provider: DS.belongsTo('preprint-provider', { inverse: 'preprints', async: true }),
    files: DS.hasMany('file-provider'),
    reviewActions: DS.hasMany('review-action', { inverse: 'target', async: true }),
    contributors: DS.hasMany('contributors', {
        allowBulkUpdate: true,
        allowBulkRemove: true,
        inverse: 'preprint'
    }),
    requests: DS.hasMany('preprint-requests', { inverse: 'target', async: true }),
    uniqueSubjects: Ember.computed('subjects', function() {
        if (!this.get('subjects')) return [];
        return this.get('subjects').reduce((acc, val) => acc.concat(val), []).uniqBy('id');
    }),

    articleDoiUrl: Ember.computed.alias('links.doi'),
    preprintDoiUrl: Ember.computed.alias('links.preprint_doi'),

    licenseText: Ember.computed('license', function() {
        const text = this.get('license.text') || '';
        const {year = '', copyright_holders = []} = this.get('licenseRecord');

        return text
            .replace(/({{year}})/g, year)
            .replace(/({{copyrightHolders}})/g, copyright_holders.join(', '));
    }),
});
