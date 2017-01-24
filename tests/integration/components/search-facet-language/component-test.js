import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('search-facet-language', 'Integration | Component | search facet language', {
  integration: true
});


test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
        this.set('key', 'languages');
        this.set('options', { key: 'languages', title: 'Language', component: 'search-facet-language' } );
        this.set('state', '');
        this.set('filter', '');
        this.set('onChange', () => {});

        this.render(hbs`{{search-facet-language
            key=key
            options=options
            state=state
            filter=filter
            onChange=(action onChange)
        }}`);

        assert.equal(this.$()[0].innerText.trim(), 'Add Language filter');
});

