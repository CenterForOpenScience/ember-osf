import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('query-syntax', 'Integration | Component | query syntax', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{query-syntax}}`);

  assert.ok(this.$().text().trim().includes('Could not perform search query.'));
});
