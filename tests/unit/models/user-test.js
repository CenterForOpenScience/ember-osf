import {
    moduleForModel,
    test
} from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: ['model:node', 'model:institution', 'model:registration']
});

test('it exists', function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});
