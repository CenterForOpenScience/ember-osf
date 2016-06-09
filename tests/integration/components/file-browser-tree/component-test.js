import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-browser-tree', 'Integration | Component | file browser tree', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{file-browser-tree}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#file-browser-tree}}
      template block text
    {{/file-browser-tree}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
