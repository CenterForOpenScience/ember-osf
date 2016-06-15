import Ember from 'ember';
import FileBrowserItemMixin from 'ember-osf/mixins/file-browser-item';
import { module, test } from 'qunit';

module('Unit | Mixin | file browser item');

// Replace this with your real tests.
test('it works', function(assert) {
  let FileBrowserItemObject = Ember.Object.extend(FileBrowserItemMixin);
  let subject = FileBrowserItemObject.create();
  assert.ok(subject);
});
