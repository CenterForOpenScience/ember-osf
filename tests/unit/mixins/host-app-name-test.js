import Ember from 'ember';
import hostAppName from 'dummy/mixins/host-app-name';
import { module, test } from 'qunit';

module('Unit | Mixin | host app name');

test('host-app-name mixin holds the hosting application name', function(assert) {
    let objectA = Ember.Component.extend(hostAppName);
    let componentA = objectA.create({ renderer: {} });
    assert.equal(hostAppName.detect(componentA), true);
    assert.equal(componentA.get('hostAppName'), 'Dummy App');
});
