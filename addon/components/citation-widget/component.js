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
    actions: {
        selectStyle(style) {
            this.set('selectedStyle', style);
            this.get('_selectStyle').perform(style.id);
        }
    },
    citationText: 'No citation selected.',
    _selectStyle: task(function* (id) {
        const citationLink = this.get('citationLink');
        const response = yield Ember.$.ajax(`${citationLink}${id}/`);
        this.set('citationText', response.data.attributes.citation);
    }).restartable(),
    findStyles: task(function* (term) {
        yield timeout(500);
        const response = yield Ember.$.ajax({
            method: 'GET',
            url: `${config.OSF.apiUrl}/${config.OSF.apiNamespace}/citations/styles/?filter[title,short_title]=${term}&page[size]=100` ,
            dataType: 'json',
            contentType: 'application/json'
        });
        if (response.links.next !== null) {
            response.data.push({
                attributes: {
                    // TODO: Can (ask product) lazy load the rest of the styles when scrolled down, once @adlius's PR is merged:
                    // https://github.com/CenterForOpenScience/ember-osf/pull/338
                    title: `There are ${response.links.meta.total - 100} more results, be more descriptive`,
                },
                disabled: true,
            });
        }
        return response.data;
    }).restartable()
});
