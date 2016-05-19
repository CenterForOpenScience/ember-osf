import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('login-form', 'Integration | Component | login form', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{login-form}}`);

  assert.equal(this.$('label[for=inputEmail3]').text(), 'Email');
  assert.ok(this.$('input[id=inputEmail3]'));
  assert.equal(this.$('label[for=inputPassword3]').text(), 'Password');
  assert.ok(this.$('input[id=inputPassword3]'));
  assert.ok(this.$('label:contains("Remember me)'));

});
