import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('osf-mode-footer', 'Integration | Component | osf mode footer', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{osf-mode-footer}}`);

  // Template block usage:
  this.render(hbs`
    {{#osf-mode-footer}}
      template block text
    {{/osf-mode-footer}}
  `);

    assert.ok(true);
});
