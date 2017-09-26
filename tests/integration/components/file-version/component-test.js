import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

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
    const currentDate = moment().format('YYYY-MM-DD h:mm A');

    this.set('fileVersion', fileVersion);
    this.set('fileVersion', 'modified_utc', currentDate);

    this.render(hbs`{{file-version version=fileVersion}}`);

    assert.equal(
        this.$('.file-version').children().eq(1).text(), 
        currentDate, 
        'Second list element should be a label with the files date'
    );

    assert.equal(
        this.$('.file-version').children().eq(2).text(), 
        0, 
        'Third list element should be a label with the download count - which is 0'
    );
});