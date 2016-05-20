import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('file-version', 'Integration | Component | file version', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('version', {'id': '1', 'size': 125, 'contentType': 'text'});
  this.render(hbs`{{file-version version=version}}`);

  assert.equal(this.$().text().trim(), 'ID: 1\n  Size: 125\n  Content type: text');

});
