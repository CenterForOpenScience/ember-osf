import { moduleFor, test } from 'ember-qunit';

moduleFor('transform:fixstring', 'Unit | Transform | fixstring', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
});

const testCases = [
    ['a regular string', 'a regular string'],
    ['multiple &amp; sequences all become &amp;', 'multiple & sequences all become &'],
    ['', ''],
    ['for now, intentionally limit which characters are fixed &amp; &lt; &gt;', 'for now, intentionally limit which characters are fixed & &lt; &gt;'],
    [null, null]
];

test('#serialize does not alter values sent from the server', function(assert) {
  let transform = this.subject();

    assert.expect(testCases.length);

    for (let [raw,] of testCases) {
        let res = transform.serialize(raw);
        assert.equal(res, raw, 'Serialized string did not match raw value');
    }
});

test('#deserialize converts values sent from the server into something display friendly', function(assert) {
    let transform = this.subject();

    assert.expect(testCases.length);

    for (let [raw, final] of testCases) {
        let res = transform.deserialize(raw);
        assert.equal(res, final, 'Incorrect string deserialization');
    }
});
