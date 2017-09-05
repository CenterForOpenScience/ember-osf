import { moduleForModel, test } from 'ember-qunit';

moduleForModel('review-log', 'Unit | Model | review log', {
    // Specify the other units that are required for this test.
    needs: ['model:preprint']
});

test('it exists', function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});
