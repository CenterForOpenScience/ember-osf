import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('sign-up', 'Integration | Component | sign up', {
  integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{sign-up}}`);

    assert.ok(this.$('input[id$=signup-input-name]').length);
    assert.ok(this.$('input[id$=signup-input-email]').length);
    assert.ok(this.$('input[id$=signup-input-confirm-email]').length);
    assert.ok(this.$('input[id$=signup-input-password]').length);
});
