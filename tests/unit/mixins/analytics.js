import Ember from 'ember';
import AnalyticsMixin from 'ember-osf/mixins/analytics';
import { module, test } from 'qunit';

module('Unit | Mixin | analytics');

// Replace this with your real tests.
test('it works', function(assert) {
  let AnalyticsMixinObject = Ember.Object.extend(AnalyticsMixin);
  let subject = AnalyticsMixinObject.create();
  assert.ok(subject);
});
