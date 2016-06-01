import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('login-form', 'Integration | Component | login form', {
    integration: true,
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{login-form}}`);

    // Test that the expected fields are present (accounting for unique IDs)
    assert.ok(this.$('input[id$=login-input-email]').length);
    assert.ok(this.$('input[id$=login-input-password]').length);
});
