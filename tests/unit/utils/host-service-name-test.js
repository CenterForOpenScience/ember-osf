import hostServiceName from 'dummy/utils/host-service-name';
import { module, test } from 'qunit';

module('Unit | Utility | host service name');


test('#fhostServiceName retrieves the current host app name', function(assert) {
    let res = hostServiceName();
    assert.strictEqual(res, 'dummy');
});