import { numberFormat } from 'dummy/helpers/number-format';
import { module, test } from 'qunit';

module('Unit | Helper | number format');

// Run tests in browser but not PhantomJS - see https://github.com/ariya/phantomjs/issues/12581
if (!/PhantomJS/.test(window.navigator.userAgent)) {
    test('transforms 4 digit number', function (assert) {
        let result = numberFormat([3500]);
        assert.equal(result, '3,500');
    });

    test('transforms 10 digit number', function (assert) {
        let result = numberFormat([1234567890]);
        assert.equal(result, '1,234,567,890');
    });
}
