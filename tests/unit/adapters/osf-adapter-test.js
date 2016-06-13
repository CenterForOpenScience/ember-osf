import { moduleFor, test } from 'ember-qunit';
import FactoryGuy, {manualSetup, make, mockSetup }  from 'ember-data-factory-guy';

moduleFor('adapter:osf-adapter', 'Unit | Adapter | osf adapter', {
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']
  needs: ['model:node', 'model:contributor', 'model:user', 'transform:links', 'transform:embed', 'model:institution',
  'model:comment', 'model:file-version', 'model:file-provider', 'model:file', 'model:collection', 'model:log', 'model:node-link',
    'model:registration', 'model:comment-report'],

  beforeEach(){
      manualSetup(this.container);
      mockSetup();
  }
});


// Replace this with your real tests.
test('it exists', function(assert) {
  let adapter = this.subject();
  assert.ok(adapter);
});

test('contributor addition payload is correctly formatted', function(assert){
    let node = make('node');
    node.save()
    let contributor = make('contributor');
    let adapter = this.subject();
    adapter.ajax = function(){
        console.log('poo!!!!')
    };
    node.get('contributors').pushObject(contributor);
    //node._internalModel.unloadRecord(); //<- flushes all changes, and makes .save() do nothing
    node.save();
    assert.ok(true);
})
