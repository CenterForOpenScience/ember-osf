import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('eosf-project-nav', 'Integration | Component | eosf project nav', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    
    this.render(hbs`{{eosf-project-nav}}`);

    assert.equal(this.$().text().trim(), '');
});
