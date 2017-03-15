import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('author-link', 'Integration | Component | author link', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    const contributor = Ember.Object.create({
        users: {
            identifiers: [],
            name: 'Mark Twain'
        }

    });
    this.set('contributor', contributor);
  this.render(hbs`{{author-link
        contributor=contributor
  }}`);

  assert.equal(this.$().text().trim(), 'Mark Twain');

});
