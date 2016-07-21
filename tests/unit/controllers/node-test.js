import { moduleFor, test } from 'ember-qunit';
import Ember from 'ember';

import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

moduleFor('controller:nodes.detail.files.provider.file', 'Unit | Controller | file', {
  // Specify the other units that are required for this test.
  needs: ['controller:nodes.detail.index', 'model:node', 'model:comment'],
    beforeEach() {
        manualSetup(this.container);
    }
});

// Replace this with your real tests.
test('it exists', function(assert) {
  let controller = this.subject();
  assert.ok(controller);
});

test('add a node tag', function(assert) {
    var ctrl = this.subject();
    let model = FactoryGuy.make('node', {tags: ['one']});
    ctrl.set('model', model);
    ctrl.set('model.save', function() {return;});
    Ember.run(function() {
        ctrl.send('addTag', 'new tag');
    });
    assert.deepEqual(ctrl.model.get('tags'), ['one', 'new tag']);
});

test('remove a node tag', function(assert) {
    var ctrl = this.subject();
    let model = FactoryGuy.make('node', {tags: ['one', 'two']});
    ctrl.set('model', model);
    ctrl.set('model.save', function() {return;});
    Ember.run(function() {
        ctrl.send('removeTag', 'one');
    });
    assert.deepEqual(ctrl.model.get('tags'), ['two']);
});
