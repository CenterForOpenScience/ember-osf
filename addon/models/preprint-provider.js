import Ember from 'ember';
import DS from 'ember-data';
import { getOwner } from '@ember/application';
import { get } from '@ember/object';
import OsfModel from 'ember-osf/models/osf-model';

export default OsfModel.extend({
    i18n: Ember.inject.service(),

    name: DS.attr('fixstring'),
    description: DS.attr('fixstring'),
    domain: DS.attr('string'),
    domainRedirectEnabled: DS.attr('boolean'),
    example: DS.attr('fixstring'),
    advisoryBoard: DS.attr('string'),
    emailSupport: DS.attr('fixstring'),
    subjectsAcceptable: DS.attr(),
    footerLinks: DS.attr('string'),
    allowSubmissions: DS.attr('boolean'),
    allowCommenting: DS.attr('boolean'),
    additionalProviders: DS.attr(),
    shareSource: DS.attr('string'),
    preprintWord: DS.attr('string'),
    facebookAppId: DS.attr('number'),
    assertionsEnabled: DS.attr('boolean'),

    // Reviews settings
    permissions: DS.attr(),
    reviewsWorkflow: DS.attr('string'),
    reviewsCommentsPrivate: DS.attr('boolean', {allowNull: true}),
    reviewsCommentsAnonymous: DS.attr('boolean', {allowNull: true}),
    reviewableStatusCounts: Ember.computed.alias('links.relationships.preprints.links.related.meta'),

    // Relationships
    taxonomies: DS.hasMany('taxonomy'),
    highlightedTaxonomies: DS.hasMany('taxonomy'),
    preprints: DS.hasMany('preprint', { inverse: 'provider', async: true }),
    licensesAcceptable: DS.hasMany('license', { inverse: null }),
    citationStyles: DS.hasMany('citation-style', { inverse: null, async: true }),

    hasHighlightedSubjects: Ember.computed.alias('links.relationships.highlighted_taxonomies.links.related.meta.has_highlighted_subjects'),
    documentType: Ember.computed('i18n', 'preprintWord', function () {
        const locale = getOwner(this).factoryFor(`locale:${this.get('i18n.locale')}/translations`).class;
        return get(locale, `documentType.${this.get('preprintWord')}`);
    }),
});
