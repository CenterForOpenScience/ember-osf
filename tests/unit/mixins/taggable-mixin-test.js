import Ember from 'ember';
import TaggableMixinMixin from 'ember-osf/mixins/taggable-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | taggable mixin');

// Replace this with your real tests.
test('it works', function(assert) {
  let TaggableMixinObject = Ember.Object.extend(TaggableMixinMixin);
  let subject = TaggableMixinObject.create();
  assert.ok(subject);
});
