import { moduleForModel, test } from 'ember-qunit';

moduleForModel('preprint-provider', 'Unit | Serializer | preprint provider', {
    needs: [
        'serializer:preprint-provider',
        'model:taxonomy',
        'model:preprint',
        'model:license',
        'model:citation-style'
    ]
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
    let record = this.subject();

    let serializedRecord = record.serialize();

    assert.ok(serializedRecord);
});
