import Ember from 'ember';
import ContributorMixinMixin from 'ember-osf/mixins/contributor-mixin';
import { module, test } from 'qunit';

module('Unit | Mixin | contributor mixin');

test('it works', function(assert) {
    const ContributorMixinObject = Ember.Object.extend(ContributorMixinMixin);
    const subject = ContributorMixinObject.create();
    assert.ok(subject);
});
