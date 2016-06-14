import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';
import { manualSetup, make }  from 'ember-data-factory-guy';

moduleFor('adapter:osf-adapter', 'Unit | Adapter | osf adapter', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  needs: ['model:node', 'model:contributor', 'model:user', 'transform:links', 'transform:embed', 'model:institution',
  'model:comment', 'model:file-version', 'model:file-provider', 'model:file', 'model:collection', 'model:log', 'model:node-link',
    'model:registration', 'model:comment-report', 'serializer:contributor'],

  beforeEach(){
      manualSetup(this.container);
  }
});

function callUpdateRecord(adapter, model) {
    let snap = new DS.Snapshot(model._internalModel);
    return adapter.updateRecord(
        model.store,
        snap.type,
        snap
    );
}

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('updateRecord formats contributor addition properly', function(assert) {
    assert.expect(4);
    let node = make('node');
    let contributor = make('contributor');
    contributor.isNew = () => true;
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        assert.equal(requestType, 'POST');
        assert.equal(data.data.data.length, 1);
        assert.ok(data.isBulk, true);
        assert.equal(
            data.data.data[0].relationships.users.data.id, contributor.get('userId')
        );
        return new Ember.RSVP.Promise(function() {});
    };
    node.get('contributors').pushObject(contributor);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord formats multiple contributor addition properly', function(assert) {
    assert.expect(5);
    let node = make('node');
    let contributor1 = make('contributor');
    let contributor2 = make('contributor');
    contributor1.isNew = () => true;
    contributor2.isNew = () => true;
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        assert.equal(requestType, 'POST');
        assert.equal(data.data.data.length, 2);
        assert.ok(data.isBulk);
        var addedContributorIds = data.data.data.map(each => each.relationships.users.data.id);
        assert.ok(addedContributorIds.indexOf(contributor1.get('userId')) !== -1);
        assert.ok(addedContributorIds.indexOf(contributor2.get('userId')) !== -1);
        return new Ember.RSVP.Promise(function() {});
    };
    node.get('contributors').pushObject(contributor1);
    node.get('contributors').pushObject(contributor2);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord can update a contributor', function(assert) {
    assert.expect(4);
    let node = make('node');
    let contributor = make('contributor');
    Ember.run(function(){
        contributor.set('bibliographic', !contributor.get('bibliographic'));
    });
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        assert.equal(requestType, 'PATCH');
        assert.equal(data.data.data.length, 1);
        assert.ok(data.isBulk, true);
        assert.equal(
            data.data.data[0].relationships.users.data.id, contributor.get('userId')
        );
        return new Ember.RSVP.Promise(function() {});
    };
    node.get('contributors').pushObject(contributor);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord can update multiple contributors', function(assert) {
    assert.expect(5);
    let node = make('node');
    let contributor1 = make('contributor');
    let contributor2 = make('contributor');
    Ember.run(function(){
        contributor1.set('bibliographic', !contributor1.get('bibliographic'));
        contributor2.set('bibliographic', !contributor2.get('bibliographic'));
    });
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        assert.equal(requestType, 'PATCH');
        assert.equal(data.data.data.length, 2);
        assert.ok(data.isBulk);
        var addedContributorIds = data.data.data.map(each => each.relationships.users.data.id);
        assert.ok(addedContributorIds.indexOf(contributor1.get('userId')) !== -1);
        assert.ok(addedContributorIds.indexOf(contributor2.get('userId')) !== -1);
        return new Ember.RSVP.Promise(function() {});
    };
    node.get('contributors').pushObject(contributor1);
    node.get('contributors').pushObject(contributor2);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord does not include unchanged contributors', function(assert) {
    assert.expect(5);
    let node = make('node');
    let contributor1 = make('contributor');
    let contributor2 = make('contributor');
    Ember.run(function(){
        contributor1.set('bibliographic', !contributor1.get('bibliographic'));
    });
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        assert.equal(requestType, 'PATCH');
        assert.equal(data.data.data.length, 1);
        assert.ok(data.isBulk);
        var addedContributorIds = data.data.data.map(each => each.relationships.users.data.id);
        assert.ok(addedContributorIds.indexOf(contributor1.get('userId')) !== -1);
        assert.ok(addedContributorIds.indexOf(contributor2.get('userId')) === -1);
        return new Ember.RSVP.Promise(function() {});
    };
    node.get('contributors').pushObject(contributor1);
    node.get('contributors').pushObject(contributor2);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord handles component creation', function(assert) {
    assert.expect(3);
    let node = make('node');
    let component = make('node');
    component.isNew = () => true;
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        assert.equal(requestType, 'POST');
        assert.equal(data.isBulk, false);
        assert.equal(data.data.data.attributes.title, component.get('title'));
        return new Ember.RSVP.Promise(function() {});
    };
    node.get('children').pushObject(component);
    node.set('_dirtyRelationships.children', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord handles multiple component creation', function(assert) {
    let node = make('node');
    let component1 = make('node');
    let component2 = make('node');
    component1.isNew = () => true;
    component2.isNew = () => true;
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        assert.equal(requestType, 'POST');
        assert.equal(data.data.data.length, 2);
        assert.ok(data.isBulk);
        let addedChildrenTitles = data.data.data.map(each => each.attributes.title);
        assert.ok(addedChildrenTitles.indexOf(component1.get('title').join()) !== -1);
        assert.ok(addedChildrenTitles.indexOf(component2.get('title').join()) !== -1);
        return new Ember.RSVP.Promise(function() {});
    };
    node.get('children').pushObject(component1);
    node.get('children').pushObject(component2);
    node.set('_dirtyRelationships.children', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord handles institution addition', function(assert) {
    assert.ok(true);
});
