import {
    moduleForModel,
    test
} from 'ember-qunit';

moduleForModel('institution', 'Unit | Model | institution', {
    // Specify the other units that are required for this test.
    needs: ['model:user', 'model:node', 'model:registration', 'model:node-link']
});

test('it exists', function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});
