import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

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
    var fileVersion = FactoryGuy.make('file-version');
    this.set('fileVersion', fileVersion);
    this.render(hbs`{{file-version version=fileVersion}}`);

    assert.equal(
        this.$('.file-version').children().eq(1).text(),
        `Size: ${fileVersion.get('size')}`,
        'Second list element should be a label with file size'
    );
});
