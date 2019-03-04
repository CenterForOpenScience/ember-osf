import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import { task } from 'ember-concurrency';
import CurrentUser from 'ember-osf/services/current-user';

const currentUserStub = CurrentUser.extend({
    setWaffle: task(function* () {
        // do_nothing
    }),
})

moduleForComponent('search-dropdown', 'Integration | Component | search dropdown', {
  integration: true,
  beforeEach() {
      this.register('service:current-user', currentUserStub);
      this.inject.service('current-user');
  },
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{search-dropdown}}`);

  // assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#search-dropdown}}
      template block text
    {{/search-dropdown}}
  `);

  //assert.equal(this.$().text().trim(), 'template block text');
  // TODO: Implement tests
  assert.ok(true);
});
