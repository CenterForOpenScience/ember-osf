import Ember from 'ember';
import {
    moduleForModel,
    test
} from 'ember-qunit';

moduleForModel('user', 'Unit | Model | user', {
    // Specify the other units that are required for this test.
    needs: ['model:node',
            'model:institution',
            'model:registration',
            'model:file',
            'model:review-action',
            'transform:fixstring',
            'transform:links',
            'transform:embed']
});

test('it exists', function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

test('it has an attribute: fullName', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('fullName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: givenName', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('givenName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: middleNames', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('middleNames') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: familyName', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('familyName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: dateRegistered', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('dateRegistered') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: username', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('username') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: fullName', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('fullName') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: canViewReviews', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('canViewReviews') > -1;
    assert.ok(hasAttr);
});

test('nodes relationship', function(assert) {
    var model = this.store().modelFor('user');
    var relationship = Ember.get(model, 'relationshipsByName').get('nodes');

    assert.equal(relationship.key, 'nodes');
    assert.equal(relationship.type, 'node');
    assert.equal(relationship.kind, 'hasMany');
});

test('registrations relationship', function(assert) {
    var model = this.store().modelFor('user');
    var relationship = Ember.get(model, 'relationshipsByName').get('registrations');

    assert.equal(relationship.key, 'registrations');
    assert.equal(relationship.type, 'registration');
    assert.equal(relationship.kind, 'hasMany');
});

test('files relationship', function(assert) {
    var model = this.store().modelFor('user');
    var relationship = Ember.get(model, 'relationshipsByName').get('quickfiles');

    assert.equal(relationship.key, 'quickfiles');
    assert.equal(relationship.type, 'file');
    assert.equal(relationship.kind, 'hasMany');
});

test('institutions relationship', function(assert) {
    var model = this.store().modelFor('user');
    var relationship = Ember.get(model, 'relationshipsByName').get('institutions');

    assert.equal(relationship.key, 'institutions');
    assert.equal(relationship.type, 'institution');
    assert.equal(relationship.kind, 'hasMany');
});

test('name computed correctly: givenName, familyName and fullName are defined', function (assert) {
    let mitsuha = this.subject({
        givenName: 'Mitsuha',
        familyName: 'Miyamizu',
        fullName: 'Mitsuha Miyamizu of Itomori'
    });
    assert.equal(mitsuha.get('name'), 'Mitsuha Miyamizu');
});

test('name computed correctly: only givenName and fullName are defined', function (assert) {
    let mitsuha = this.subject({
        givenName: 'Mitsuha',
        fullName: 'Mitsuha Miyamizu of Itomori'
    });
    assert.equal(mitsuha.get('name'), 'Mitsuha Miyamizu of Itomori');
});

test('name computed correctly: only familyName and fullName are defined', function (assert) {
    let mitsuha = this.subject({
        familyName: 'Miyamizu',
        fullName: 'Mitsuha Miyamizu of Itomori'
    });
    assert.equal(mitsuha.get('name'), 'Mitsuha Miyamizu of Itomori');
});

test('name computed correctly: only fullName is defined', function (assert) {
    let mitsuha = this.subject({
        fullName: 'Mitsuha Miyamizu of Itomori'
    });
    assert.equal(mitsuha.get('name'), 'Mitsuha Miyamizu of Itomori');
});
