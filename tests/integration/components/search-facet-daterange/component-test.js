import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-facet-daterange', 'Integration | Component | search facet daterange', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{search-facet-daterange}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#search-facet-daterange}}
      template block text
    {{/search-facet-daterange}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
