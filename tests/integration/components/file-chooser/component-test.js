import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-chooser', 'Integration | Component | file chooser', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{file-chooser}}`);

  assert.equal(this.$().text().trim(), 'You can also drag and drop a file from your computer.');

  // Template block usage:
  this.render(hbs`
    {{#file-chooser}}
      template block text
    {{/file-chooser}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
