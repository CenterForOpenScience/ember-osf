import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sign-up', 'Integration | Component | sign up', {
  integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{sign-up}}`);

    assert.ok(this.$('input[id=inputName]').length);
    assert.ok(this.$('input[id=inputEmail]').length);
    assert.ok(this.$('input[id=inputEmail2]').length);
    assert.ok(this.$('input[id=inputPassword3]').length);
});
