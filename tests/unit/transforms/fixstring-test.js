import { moduleFor, test } from 'ember-qunit';

import { fixStringTestCases } from '../../fixtures/specialChars';

moduleFor('transform:fixstring', 'Unit | Transform | fixstring', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

test('#serialize does not alter values sent from the server', function(assert) {
  let transform = this.subject();

    assert.expect(fixStringTestCases.length);

    for (let [raw,] of fixStringTestCases) {
        let res = transform.serialize(raw);
        assert.equal(res, raw, 'Serialized string did not match raw value');
    }
});

test('#deserialize converts values sent from the server into something display friendly', function(assert) {
    let transform = this.subject();

    assert.expect(fixStringTestCases.length);

    for (let [input, output] of fixStringTestCases) {
        let res = transform.deserialize(input);
        assert.strictEqual(res, output, 'Incorrect string deserialization');
    }
});
