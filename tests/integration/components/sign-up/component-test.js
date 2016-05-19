import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sign-up', 'Integration | Component | sign up', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{sign-up}}`);

  assert.equal(this.$('label[for=inputName]').text(), 'Full Name');
  assert.ok(this.$('input[id=inputName]'));
  assert.equal(this.$('label[for=inputEmail]').text(), 'Email');
  assert.ok(this.$('input[id=inputEmail]'));
  assert.equal(this.$('label[for=inputEmail2]').text(), 'Confirm Email');
  assert.ok(this.$('input[id=inputEmail2]'));
  assert.equal(this.$('label[for=inputPassword3]').text(), 'Password');
  assert.ok(this.$('input[id=inputPassword3]'));

});
