import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

moduleFor('controller:nodes.detail.files.provider.file', 'Unit | Controller | file', {
  // Specify the other units that are required for this test.
  needs: ['controller:nodes.detail.files.provider.file']
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('add a file tag', function(assert) {
    var ctrl = this.subject();
    ctrl.set('model', Ember.Object.create({tags: ['one']}));
    ctrl.set('model.save', function() {return;});
    ctrl.send('addATag', 'new tag');
    assert.deepEqual(ctrl.model.get('tags'), ['one', 'new tag']);
});

test('remove a file tag', function(assert) {
    var ctrl = this.subject();
    ctrl.set('model', Ember.Object.create({tags: ['one', 'two']}));
    ctrl.set('model.save', function() {return;});
    ctrl.send('removeATag', 'one');
    assert.deepEqual(ctrl.model.get('tags'), ['two']);
});
