import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

//import FactoryGuy from 'ember-data-factory-guy';
import FactoryGuy, {manualSetup }  from 'ember-data-factory-guy';

moduleForComponent('file-version', 'Integration | Component | file version', {
    integration: true,

    beforeEach: function() {
        // Set up factory guy, per docs
        manualSetup(this.container);
    }
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    let version = FactoryGuy.make('file-version');
    this.render(hbs`{{file-version version=version}}`);

    assert.equal(
        this.$('.file-version').children().eq(1).text(),
        `Size: ${version.get('size')}`,
        'Second list element should be a label with file size');
});
