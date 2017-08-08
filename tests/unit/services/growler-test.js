import { moduleFor, test } from 'ember-qunit';

moduleFor('service:growler', 'Unit | Service | growler', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

// Growler does nothing without accompanying growl-box. Tests for its
// functionality are part of integration/components/growl-box/component-test.js
test('it exists', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
