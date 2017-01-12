import Ember from 'ember';
import layout from './template';

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

    didRender() {
        const node = this.get('node');

        if (!node) {
            return;
        }

        const citationLink = node.get('links.relationships.citation.links.related.href');

        for (const { linkSuffix, attr } of citationStyles) {
            this.get('store')
                .adapterFor('node')
                .ajax(`${citationLink}${linkSuffix}/`, 'GET')
                .then(resp => this.set(attr, resp.data.attributes.citation));
        }
    }
});
