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
    $.mockjax({
        url: '/nodes/*',
        response: function() {
        }
    });
    let node = make('node');
    let contributor = make('contributor');
    contributor.isNew =  () => true;
    let adapter = this.subject();
    adapter.ajax = function() {
        //make all assertions
        debugger;
        return 'Coolbeans'
    };
    node.get('contributors').pushObject(contributor);
    node.set('_dirtyRelationships.contributors', true);
    callUpdateRecord(adapter, node);
})
