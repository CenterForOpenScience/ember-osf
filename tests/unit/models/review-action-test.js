import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('review-action', 'Unit | Model | review-action', {
    // Specify the other units that are required for this test.
    needs: ['model:preprint',
            'model:preprint-provider',
            'model:user',
            'transform:links',
            'transform:embed',]
});

test('it exists', function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

test('it has an attribute: actionTrigger', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('actionTrigger') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: comment', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('comment') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: fromState', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('fromState') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: toState', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('toState') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: dateCreated', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('dateCreated') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: dateModified', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('dateModified') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: actionTrigger', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('actionTrigger') > -1;
    assert.ok(hasAttr);
});

test('preprint-provider relationship', function(assert) {
    var model = this.store().modelFor('review-action');
    var relationship = Ember.get(model, 'relationshipsByName').get('provider');

    assert.equal(relationship.key, 'provider');
    assert.equal(relationship.type, 'preprint-provider');
    assert.equal(relationship.kind, 'belongsTo');
});

test('target relationship', function(assert) {
    var model = this.store().modelFor('review-action');
    var relationship = Ember.get(model, 'relationshipsByName').get('target');

    assert.equal(relationship.key, 'target');
    assert.equal(relationship.type, 'preprint');
    assert.equal(relationship.kind, 'belongsTo');
});

test('user relationship', function(assert) {
    var model = this.store().modelFor('review-action');
    var relationship = Ember.get(model, 'relationshipsByName').get('creator');

    assert.equal(relationship.key, 'creator');
    assert.equal(relationship.type, 'user');
    assert.equal(relationship.kind, 'belongsTo');
});
