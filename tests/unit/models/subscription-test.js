import { moduleForModel, test } from 'ember-qunit';

moduleForModel('subscription', 'Unit | Model | contributor', {
    // Specify the other units that are required for this test.
    needs: [
        'transform:links',
        'transform:embed',
    ]
});

test('it exists', function(assert) {
    let model = this.subject();
    assert.ok(!!model);
});

test('it has an attribute: frequency', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('frequency') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: eventName', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('eventName') > -1;
    assert.ok(hasAttr);
});
