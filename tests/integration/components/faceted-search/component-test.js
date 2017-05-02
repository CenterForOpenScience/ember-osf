import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('faceted-search', 'Integration | Component | faceted search', {
  integration: true
});

 // {{faceted-search
 //                        onChange='filtersChanged'
 //                        updateParams='updateParams'
 //                        filters=facetFilters
 //                        facetStates=facetStates
 //                        facets=facets
 //                        aggregations=aggregations
 //                    }}

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

    let noop = () => {};
    this.set('noop', noop);
    this.set('facetStates', {contributors: '', language: ''});
    this.set('facets', [{
        key: 'sources', title: 'Sources', component: 'search-facet-locked', locked_items: ['PubMedCentral']
    }]);
    this.set('filters', {});

  this.render(hbs`{{faceted-search
      onChange=(action noop)
      updateParams=(action noop)
      facetStates=facetStates
      facets=facets
      filters=filters
  
  }}`);

  assert.equal(document.getElementsByTagName('button')[1].firstChild.nodeValue, 'PubMedCentral');
});
