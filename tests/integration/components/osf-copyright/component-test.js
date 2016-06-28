import {
    moduleForComponent,
    test
} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('osf-copyright', 'Integration | Component | osf copyright', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs `{{osf-copyright}}`);


    // Template block usage:
    this.render(hbs `
    {{#osf-copyright}}
      template block text
    {{/osf-copyright}}
  `);

    assert.ok(true);
});
