import Ember from 'ember';
import FileItemMixin from 'ember-osf/mixins/file-item';
import { module, test } from 'qunit';

module('Unit | Mixin | file item');

// Replace this with your real tests.
test('it works', function(assert) {
  let FileItemObject = Ember.Object.extend(FileItemMixin);
  let subject = FileItemObject.create();
  assert.ok(subject);
});
