import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-facet-worktype', 'Integration | Component | search facet worktype', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('key', 'type');
    this.set('title', 'Type');
    this.set('state', ['Publication']);
    this.set('filter', '');
    this.set('onChange', () => {});

    this.render(hbs`{{search-facet-worktype
        key=key
        state=state
        filter=filter
        onChange=(action onChange)
        selected=selected
    }}`);

  assert.equal(document.getElementsByTagName('button')[1].innerText, 'Publication');
});
