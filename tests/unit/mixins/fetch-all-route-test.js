import Ember from 'ember';
import { module, test } from 'qunit';

import FetchAllRouteMixin from 'ember-osf/mixins/fetch-all-route';

module('Unit | Mixin | fetch all route', {

    // TODO: Once tests working, refactor to use before and beforeEach

    before() {
        this.routeClass = 1;
    },
    beforeEach() {

    }}
);




function callModelHook(route) {
    var model;
    Ember.run(() => {
        route.model().then(result => {
            model = result;
        });
    });
}

function mockQuery() {
    return Ember.RSVP.resolve(
        Ember.ArrayProxy.create({
            content: [1, 2, 3, 4],
            meta: {
                total: 3
            }
        })
    );
}

// Replace this with your real tests.
test('it works', function(assert) {
    let FetchAllObject = Ember.Object.extend(FetchAllRouteMixin);
    let subject = FetchAllObject.create();
    assert.ok(subject);
});


test('Auto-fetches multiple pages of results when expected', function(assert) {

    let FetchAllRoute = Ember.Route.extend(FetchAllRouteMixin, {
        fakeStorage: null,

        model() {
            return this.infinityModel('some_model', {
                modelPath: 'fakeStorage',
                _storeFindMethod: mockQuery
            });
        },

        infinityModelLoaded({totalPages}) {
            let storage = this.get('fakeStorage');
            assert.equal(totalPages, 3);
            assert.equal(storage.length, 12);
        }
    });

    let subject = FetchAllRoute.create({
        'fakeStorage': Ember.A([1,2,3,4])  // infinity doesn't start pushing objects until page 2, so prefill storage with page 1
    });
    callModelHook(subject);
});



// TODO
// Things I'd like to test...
// 1.[x] Mock the fetch operation. Confirm that if we expect 3 pages of results, then a function will fire 3x by end of test (will need to block test execution until done?)
// 2. [x] Confirm the modelPath variable contains the expected number of results when done
// 3. Test configuration of relationship fetching works as expected

