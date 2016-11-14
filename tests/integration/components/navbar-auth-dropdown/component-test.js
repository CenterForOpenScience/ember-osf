import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('navbar-auth-dropdown', 'Integration | Component | navbar auth dropdown', {
    integration: true
});

test('it renders', function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('loginAction', ()=>{});
    this.render(hbs`{{navbar-auth-dropdown loginAction=loginAction}}`);

    assert.notEqual(this.$().text().trim(), '');
});
