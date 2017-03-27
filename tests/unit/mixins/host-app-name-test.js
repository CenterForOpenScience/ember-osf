import Ember from 'ember';
import hostAppName from 'ember-osf/mixins/host-app-name';
import { module, test } from 'qunit';

module('Unit | Mixin | host app name');

// Replace this with your real tests.
test('it works', function(assert) {
    let appName = Ember.Object.extend(hostAppName);
    let name = appName.create();
    assert.ok(name);
});
