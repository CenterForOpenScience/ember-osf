import FactoryGuy from 'ember-data-factory-guy';

FactoryGuy.define('share-search-result', {
    default: {
        identifiers: [],
        contributors: [{ users: ({ bibliographic: 'Todd Frak', name: 'Todd Frak', identifiers: 'kjhg85' }) }],
        subjects: [({ text: 'psychology' })],
        providers: [{ name: 'test provider1' }, { name: 'test provider2' }],
        infoLinks: [{ type: 'url', uri: 'test URI1' }, { type: 'test', uri: 'testURI2' }],
        title: 'Tests to live by',
        date: '04-19-2017',
        dateModified: '04-20-2017',
        abstract: "This is just a test",
        description: 'test text to test'
    }
});
