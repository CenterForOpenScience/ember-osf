import Ember from 'ember';
import FileCacheBypassMixin from 'ember-osf/mixins/file-cache-bypass';
import { module, test } from 'qunit';

module('Unit | Mixin | file cache bypass');

// Replace this with your real tests.
test('it works', function(assert) {
  let FileCacheBypassObject = Ember.Object.extend(FileCacheBypassMixin);
  let subject = FileCacheBypassObject.create();
  assert.ok(subject);
});
