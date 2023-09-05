import Ember from 'ember';
import DS from 'ember-data';

import OsfModel from './osf-model';

export default OsfModel.extend({
    currentUser: Ember.inject.service('current-user'),

    title: DS.attr('fixstring'),
    shortTitle: DS.attr('fixstring'),
    summary: DS.attr('fixstring'),
    created: DS.attr('date'),
    modified: DS.attr('date'),
    dateParsed: DS.attr('date'),
    hasBibliography: DS.attr('boolean'),
    nodeCitation: DS.attr('fixstring'),

    fetchCitation(node) {
        const citationLink = node.get('links.relationships.citation.links.related.href');
        const id = this.get('id');

        return this.get('currentUser').authenticatedAJAX({ url: `${citationLink}${id}` })
            .done(response => {
                this.set('nodeCitation', response.data.attributes.citation);
            });
    },
});
