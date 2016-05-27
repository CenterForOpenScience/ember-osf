import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('login-form', 'Integration | Component | login form', {
    integration: true,
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{login-form}}`);

    // "This" is not the component instance itself, but rather an object with a different GUID
    // We can hack it but not proudly
    let someID = this.$().children().attr('id');

    // Test that the expected fields are present (accounting for unique IDs)
    assert.ok(this.$(`input[id=${someID}-login-input-email]`).length);
    assert.ok(this.$(`input[id=${someID}-login-input-password]`).length);
});
