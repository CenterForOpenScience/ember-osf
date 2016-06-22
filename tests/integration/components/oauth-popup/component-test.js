import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('oauth-popup', 'Integration | Component | oauth popup', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{oauth-popup}}`);


  assert.equal(this.$().text().trim(), 'Login');

  // Template block usage:
  this.render(hbs`
    {{#oauth-popup}}
      template block text
    {{/oauth-popup}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
