import Ember from 'ember';
import NodeActionsMixin from 'ember-osf/mixins/node-actions';
import { module, test } from 'qunit';

module('Unit | Mixin | node actions');

// Replace this with your real tests.
test('it works', function(assert) {
  let NodeActionsObject = Ember.Object.extend(NodeActionsMixin);
  let subject = NodeActionsObject.create();
  assert.ok(subject);
});
