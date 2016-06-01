import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('osf-navbar', 'Integration | Component | osf navbar', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{osf-navbar}}`);

    //assert.equal(this.$().text().trim(), '');


    // Template block usage:
    this.render(hbs`
        {{#osf-navbar}}
            template block text
        {{/osf-navbar}}
    `);

    //assert.equal(this.$().text().trim(), 'template block text');
    // TODO: Implement tests that check a variety of different conditionals used by navbar to control what is displayed
    assert.ok(true);
});
