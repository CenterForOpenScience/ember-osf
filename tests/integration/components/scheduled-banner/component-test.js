import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('scheduled-banner', 'Integration | Component | scheduled banner', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{scheduled-banner}}`);

  assert.ok(this.$());
});
