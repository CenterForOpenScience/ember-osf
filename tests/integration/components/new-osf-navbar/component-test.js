import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('new-osf-navbar', 'Integration | Component | new osf navbar', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    const login = () => {};
    this.set('login', login);

    this.render(hbs`{{new-osf-navbar
        loginAction=(action login)    
    }}`);

  assert.ok(this.$('primary-nav').context.innerText.replace(/\s+/g, " ").includes('OSF'));

});
