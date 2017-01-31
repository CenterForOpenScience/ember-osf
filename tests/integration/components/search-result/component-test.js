import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-result', 'Integration | Component | search result', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('addFilter', () => {});
    this.set('obj', {
        title: 'Hello',
        id: '12345',
        type: 'Retraction'
    });
    this.render(hbs`{{search-result
        addFilter=(action addFilter)
        obj=obj
  
    }}`);

  assert.equal(this.$().text().trim(), 'Hello');
});
