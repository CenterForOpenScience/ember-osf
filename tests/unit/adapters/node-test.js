import {
    moduleFor,
    // test
} from 'ember-qunit';

moduleFor('adapter:node', 'Unit | Adapter | node', {
    // Specify the other units that are required for this test.
    needs: ['model:node']
});

// TODO These tests need to be rewritten if temporary buildURL changes stay.  buildURL looking at snapshot.record
// to see if there is a self link.  Snapshot will be needed for test.

// test('it embeds contributors on non C.U.D. methods', function(assert) {
//     let adapter = this.subject();
//
//     let url = adapter.buildURL('nodes', null, null, 'findRecord', null);
//     assert.ok(url.indexOf('embed=contributors'));
// });
// test('it doesn\'t try to embed contributors on C.U.D. methods', function(assert) {
//     let adapter = this.subject();
//
//     // TODO add tests for DELETE
//     ['create', 'update'].forEach((verb) => {
//         let url = adapter.buildURL('nodes', null, null, `${verb}Record`, null);
//         assert.equal(url.indexOf('embed=contributors'), -1);
//     });
// });
