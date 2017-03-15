import DS from 'ember-data';
import OsfModel from 'ember-osf/models/osf-model';

export default OsfModel.extend({
    name: DS.attr('fixstring'),
    logoPath: DS.attr('string'),
    bannerPath: DS.attr('string'),
    description: DS.attr('fixstring'),
    example: DS.attr('fixstring'),
    advisoryBoard: DS.attr('string'),
    emailContact: DS.attr('fixstring'),
    emailSupport: DS.attr('fixstring'),
    blogUrl: DS.attr('string'),
    socialTwitter: DS.attr('fixstring'),
    socialFacebook: DS.attr('fixstring'),
    socialInstagram: DS.attr('fixstring'),
    aboutLink: DS.attr('fixstring'),
    headerText: DS.attr('fixstring'),
    subjectsAcceptable: DS.attr(),
    // Relationships
    taxonomies: DS.hasMany('taxonomy'),
    preprints: DS.hasMany('preprint', { inverse: 'provider', async: true }),
    licensesAcceptable: DS.hasMany('license', { inverse: null }),
});
