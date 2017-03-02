import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('osf-navbar', 'Integration | Component | osf navbar', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('loginAction', ()=>{});
    this.render(hbs`{{osf-navbar loginAction=loginAction}}`);

    assert.ok(this.$('primary-nav').context.innerText.replace(/\s+/g, " ").includes('OSF'));
    // TODO: Implement tests that check a variety of different conditionals used by navbar to control what is displayed
});
