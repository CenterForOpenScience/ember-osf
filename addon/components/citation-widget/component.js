import Ember from 'ember';
import layout from './template';

/**
 * @module ember-osf
 * @submodule components
 */

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
        let node = this.get('node');
        if (!node) {
            return;
        }
        let citationLink = node.get('links.relationships.citation.links.related.href');

        this.get('store').adapterFor('node').ajax(citationLink + 'apa/', 'GET').then(resp => {
            this.set('apa', resp.data.attributes.citation);
        });

        this.get('store').adapterFor('node').ajax(citationLink + 'chicago-author-date/', 'GET').then(resp => {
            this.set('chicago', resp.data.attributes.citation);
        });

        this.get('store').adapterFor('node').ajax(citationLink + 'modern-language-association/', 'GET').then(resp => {
            this.set('mla', resp.data.attributes.citation);
        });
    }

});
