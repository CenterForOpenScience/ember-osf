import Ember from 'ember';
import DS from 'ember-data';
import { moduleFor, test } from 'ember-qunit';
import FactoryGuy, {manualSetup, build, make, mockSetup }  from 'ember-data-factory-guy';

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

function callUpdateRecord(adapter, model){
    let snap = new DS.Snapshot(model._internalModel);
    return adapter.updateRecord(
        model.store,
        snap.type,
        snap
    )
}

// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('updateRecord formats contributor addition properly', function(assert){
    let node = make('node');
    let contributor = make('contributor');
    contributor._internalModel.isNew = () => true;
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        //make all assertions
        assert.equal(requestType, 'POST');
        assert.equal(data.data.data.length, 1);
        assert.ok(data.isBulk, true);
        assert.equal(
            data.data.data[0].relationships.users.data.id, contributor.get('userId')
        );
        return new Ember.RSVP.Promise(function(){})
    };
    node.get('contributors').pushObject(contributor);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord formats multiple contributor addition properly', function(assert){
    let node = make('node');
    let contributor1 = make('contributor');
    let contributor2 = make('contributor');
    contributor1._internalModel.isNew = () => true
    contributor2._internalModel.isNew = () => true;
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        //make all assertions
        assert.equal(requestType, 'POST');
        assert.equal(data.data.data.length, 2);
        assert.ok(data.isBulk);
        var addedContributorIds = data.data.data.map(each => each.relationships.users.data.id)
        assert.ok(addedContributorIds.indexOf(contributor1.get('userId')) !== -1);
        assert.ok(addedContributorIds.indexOf(contributor2.get('userId')) !== -1);
        return new Ember.RSVP.Promise(function(){})
    };
    node.get('contributors').pushObject(contributor1);
    node.get('contributors').pushObject(contributor2);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});

test('updateRecord can update a contributor', function(assert){
    let node = make('node');
    let contributor = make('contributor');
    Ember.run(function(){
        contributor.set('bibliographic', !contributor.get('bibliographic'));
    });
    let adapter = this.subject();
    adapter.ajax = function(_, requestType, data) {
        //make all assertions
        assert.equal(requestType, 'PATCH');
        debugger;
        assert.equal(data.data.data.length, 1);
        assert.ok(data.isBulk, true);
        assert.equal(
            data.data.data[0].relationships.users.data.id, contributor.get('userId')
        );
        return new Ember.RSVP.Promise(function(){})
    };
    node.get('contributors').pushObject(contributor);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
});
