import { hostServiceNameHelper } from 'dummy/helpers/host-service-name';
import { module, test } from 'qunit';

module('Unit | Helper | host service name helper');


test('#hostServiceNameHelper uses hostServiceName', function(assert) {
    let res = hostServiceNameHelper();
    assert.strictEqual(res, 'dummy');
});
