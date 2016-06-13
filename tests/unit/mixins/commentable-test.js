import Ember from 'ember';
import CommentableMixin from 'ember-osf/mixins/commentable';
import { module, test } from 'qunit';

module('Unit | Mixin | commentable');

// Replace this with your real tests.
test('it works', function(assert) {
  let CommentableObject = Ember.Object.extend(CommentableMixin);
  let subject = CommentableObject.create();
  assert.ok(subject);
});
