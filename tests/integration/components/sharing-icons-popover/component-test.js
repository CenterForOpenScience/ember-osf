import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('sharing-icons-popover', 'Integration | Component | sharing-icons-popover', {
    integration: true,
    beforeEach: function() {
        let noop = () => {};
        this.set('noop', noop);
    }
});

let result = Ember.Object.extend({
    identifiers: [],
    contributors: [{ users: ({ bibliographic: 'Todd Frak', name: 'Todd Frak', identifiers: 'kjhg85' }) }],
    subjects: [({ text: 'psychology' })],
    providers: [{ name: 'test provider1' }, { name: 'test provider2' }],
    infoLinks: [{ type: 'url', uri: 'test URI1' }, { type: 'test', uri: 'testURI2' }],
    id: 'test',
    title: 'Tests to live by',
    date: '04-19-2017',
    dateModified: '04-20-2017',
    abstract: "This is just a test",
    description: 'test text to test'
});


test('it renders', function(assert) {
    // Tests that the component render the title as a link when a hyperlink is passed
    let preprint = result.create();
    this.set('preprint', preprint);
    this.set('hyperlink', 'nerds');

    this.render(Ember.HTMLBars.compile(`{{sharing-icons-popover
        title=result.title
        description=result.description
        hyperlink=hyperlink
        metricsExtra=result.id
    }}`))

    assert.ok(this.$('.share-popover').length);
});
