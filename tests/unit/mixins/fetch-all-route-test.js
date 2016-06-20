import Ember from 'ember';
import { module, test } from 'qunit';
import sinonTest from 'dummy/tests/ember-sinon-qunit/test';

import FetchAllRouteMixin from 'ember-osf/mixins/fetch-all-route';

module('Unit | Mixin | fetch all route' //, {

    // TODO: Once tests working, refactor to use before and beforeEach
    //
    // before() {
    //     this.routeClass =
    // },
    // beforeEach() {
    //
    // }}
);




function callModelHook(route) {
    var model;
    Ember.run(() => {
        route.model().then(result => {
            model = result;
            route._loadNextPage();
        });
    });
}

// Replace this with your real tests.
test('it works', function(assert) {
    let FetchAllObject = Ember.Object.extend(FetchAllRouteMixin);
    let subject = FetchAllObject.create();
    assert.ok(subject);
});


sinonTest('Auto-fetches multiple pages of results when expected', function(assert) {

    let FetchAllRoute = Ember.Route.extend(FetchAllRouteMixin, {
        fakeStorage: Ember.A(),

        model() {
            return this.infinityModel('some_model', {
                modelPath: 'fakeStorage',
                _storeFindMethod:
                    () => {
                        return Ember.ArrayProxy.create({
                            content: [1, 2, 3, 4],
                            meta: {
                                total: 3
                            }
                        });
                    }
            });
        },

        infinityModelLoaded(lastPageLoaded, totalPages, infinityModel) {
            console.log('get assertive');
            assert.equal(totalPages, 3);
            assert.equal(infinityModel.length, 3);
        }
    });

    let subject = FetchAllRoute.create();
    callModelHook(subject);

});



// TODO
// Things I'd like to test...
// 1. Mock the fetch operation. Confirm that if we expect 3 pages of results, then a function will fire 3x by end of test (will need to block test execution until done?)
// 2. Confirm the modelPath variable contains the expected number of results when done
// 3. Test configuration of relationship fetching works as expected

