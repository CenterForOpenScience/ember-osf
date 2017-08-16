import { customTaxonomyFilter } from 'dummy/helpers/custom-taxonomy-filter';
import { module, test } from 'qunit';

module('Unit | Helper | custom taxonomy filter');

test('replace very deep custom taxonomy hierarchy with just final subject name', function(assert) {
    let result = customTaxonomyFilter(['bepress|Fruits|Bananas|Green Bananas|Small / Green Bananas|Small Green Bananas with Polka Dots']);
    assert.equal(result, 'Small Green Bananas with Polka Dots');
});

test('replace shallow custom taxonomy with just final subject name', function(assert) {
    let result = customTaxonomyFilter(['bepress|Fruits']);
    assert.equal(result, 'Fruits');
});

test('return original subject if not a custom taxonomy', function(assert) {
    let result = customTaxonomyFilter(['Fruits and Bananas']);
    assert.equal(result, 'Fruits and Bananas');
});

test('return original subject if separated with slashes', function(assert) {
    let result = customTaxonomyFilter(['osf/Fruits/Bananas']);
    assert.equal(result, 'osf/Fruits/Bananas');
});
