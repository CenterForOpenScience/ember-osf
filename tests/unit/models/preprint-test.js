import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('preprint', 'Unit | Model | preprint', {
    // Specify the other units that are required for this test.
    needs: ['model:contributor',
            'model:file',
            'model:file-provider',
            'model:preprint-provider',
            'model:action',
            'model:review-action',
            'model:node',
            'model:license',
            'transform:fixstring',
            'transform:links',
            'transform:embed',]
});

test('it exists', function(assert) {
    let model = this.subject();
    // let store = this.store();
    assert.ok(!!model);
});

test('it has an attribute: title', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('title') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: subjects', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('subjects') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: dateCreated', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('dateCreated') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: datePublished', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('datePublished') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: originalPublicationDate', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('originalPublicationDate') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: dateModified', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('dateModified') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: doi', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('doi') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: isPublished', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('isPublished') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: isPreprintOrphan', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('isPreprintOrphan') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: licenseRecord', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('licenseRecord') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: reviewsState', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('reviewsState') > -1;
    assert.ok(hasAttr);
});

test('it has an attribute: dateLastTransitioned', function(assert) {
    var model = this.subject();
    var hasAttr = Object.keys(model.toJSON()).indexOf('dateLastTransitioned') > -1;
    assert.ok(hasAttr);
});

test('node relationship', function(assert) {
    var model = this.store().modelFor('preprint');
    var relationship = Ember.get(model, 'relationshipsByName').get('node');

    assert.equal(relationship.key, 'node');
    assert.equal(relationship.type, 'node');
    assert.equal(relationship.kind, 'belongsTo');
});

test('license relationship', function(assert) {
    var model = this.store().modelFor('preprint');
    var relationship = Ember.get(model, 'relationshipsByName').get('license');

    assert.equal(relationship.key, 'license');
    assert.equal(relationship.type, 'license');
    assert.equal(relationship.kind, 'belongsTo');
});

test('file relationship', function(assert) {
    var model = this.store().modelFor('preprint');
    var relationship = Ember.get(model, 'relationshipsByName').get('primaryFile');

    assert.equal(relationship.key, 'primaryFile');
    assert.equal(relationship.type, 'file');
    assert.equal(relationship.kind, 'belongsTo');
});

test('preprint-provider relationship', function(assert) {
    var model = this.store().modelFor('preprint');
    var relationship = Ember.get(model, 'relationshipsByName').get('provider');

    assert.equal(relationship.key, 'provider');
    assert.equal(relationship.type, 'preprint-provider');
    assert.equal(relationship.kind, 'belongsTo');
});

test('action relationship', function(assert) {
    var model = this.store().modelFor('preprint');
    var relationship = Ember.get(model, 'relationshipsByName').get('actions');

    assert.equal(relationship.key, 'actions');
    assert.equal(relationship.type, 'action');
    assert.equal(relationship.kind, 'hasMany');
});

test('contributors relationship', function(assert) {
    var model = this.store().modelFor('preprint');
    var relationship = Ember.get(model, 'relationshipsByName').get('contributors');

    assert.equal(relationship.key, 'contributors');
    assert.equal(relationship.type, 'contributor');
    assert.equal(relationship.kind, 'hasMany');
});
