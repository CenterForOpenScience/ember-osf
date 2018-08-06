import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import CurrentUser from 'ember-osf/services/current-user';
import { task } from 'ember-concurrency';

const currentUserStub = CurrentUser.extend({
    setWaffle: task(function* () {
        // do_nothing
    }),
})

moduleForComponent('dropzone-widget', 'Integration | Component | dropzone widget', {
  integration: true,
  beforeEach(){
      this.register('service:current-user', currentUserStub);
  }
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.inject.service('current-user');
  this.render(hbs`{{dropzone-widget}}`);

  assert.equal(this.$().text().trim(), 'Drop files here to upload');
});
