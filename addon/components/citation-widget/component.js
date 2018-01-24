import Ember from 'ember';
import layout from './template';
import { task, timeout } from 'ember-concurrency';
import config from 'ember-get-config';

/**
 * @module ember-osf
 * @submodule components
 */

const citationStyles = [
    {
        linkSuffix: 'apa',
        attr: 'apa'
    },
    {
        linkSuffix: 'chicago-author-date',
        attr: 'chicago'
    },
    {
        linkSuffix: 'modern-language-association',
        attr: 'mla'
    }
];

/**
 * Lists citations for node in APA, MLA, and Chicago formats
 *
 * @class citation-widget
 * @param {node} node for which to fetch citations
 */
export default Ember.Component.extend({
    layout,
    apa: null,
    chicago: null,
    mla: null,
    node: null,
    store: Ember.inject.service(),
    styles: Ember.A([]),
    selectedStyle: 'Enter citation style (e.g. "APA")',
    didReceiveAttrs() {
        const node = this.get('node');

        if (!node) {
            return;
        }

        const citationLink = node.get('links.relationships.citation.links.related.href');
        this.set('citationLink', citationLink);

        for (const { linkSuffix, attr } of citationStyles) {
            this.get('store')
                .adapterFor('node')
                .ajax(`${citationLink}${linkSuffix}/`, 'GET')
                .then(resp => this.set(attr, resp.data.attributes.citation));
        }
    },
    _citationText: Ember.observer('selectedStyle', function() {
        const citationLink = this.get('citationLink');
        return Ember.$.ajax(`${citationLink}${this.get('selectedStyle.id')}/`).then(resp => this.set('citationText', resp.data.attributes.citation));
    }),
    citationText: 'No citation selected.',
    findStyles: task(function* (term) {
        yield timeout(500);
        return Ember.$.ajax({
            method: 'GET',
            url: `${config.OSF.apiUrl}/${config.OSF.apiNamespace}/citations/styles/?filter[title,short_title]=${term}&page[size]=100` ,
            dataType: 'json',
            contentType: 'application/json'
        }).then(res => {
            if (res.links.next !== null) {
                this.findMoreStyles(term, res.links.next);
            }
            if (res.links.prev === null) this.set('styles', res.data);
            else this.get('styles').pushObjects(res.data);
        }).then(() => this.get('styles'));
    }).restartable(),
});
