import Ember from 'ember';
import { module, test } from 'qunit';

import FetchAllRouteMixin from 'ember-osf/mixins/fetch-all-route';

module('Unit | Mixin | fetch all route', {
    beforeEach() {
        this.routeClass = Ember.Route.extend(FetchAllRouteMixin, {});
    }}
);

/**
 * Call model hook in a run loop and set up controller. From ember infinity tests.
 * @param route
 * @returns {*}
 */
function callModelHook(route) {
    var model;
    Ember.run(() => {
        route.model().then(result => {
            model = result;
        });
    });
    route.set('controller', Ember.Object.create({ model }));
    return model;
}

/**
 * Mock out queries to the ember store
 * @param numPages
 * @param content
 * @returns {*}
 */
function mockQuery({numPages=3, content=[1,2,3,4]}) {
    return Ember.RSVP.resolve(
        Ember.ArrayProxy.create({
            content: content,
            meta: {
                total: numPages
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
    assert.expect(2);
    let subject = this.routeClass.create({
        'fakeStorage': Ember.A([1,2,3,4]),  // For regular models, infinity doesn't start pushing objects until page 2, so prefill storage with page 1
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
    // Kick off event loop that ends in assertions
    callModelHook(subject);
});

// TODO: Check that configuration parameters can alter what params are used in URLs?

// SINONjs spies will be helpful for this- can inspect calledWith

test('Auto-fetches relationships fields from model hook', function(assert) {
    let subject = this.routeClass.create({
        relationshipToFetch: 'string triggers behavior',
        model() {
            return Ember.RSVP.resolve({
                data: ['a', 'b', 'c'],
                query: mockQuery
            });
        },
        infinityModelLoaded({totalPages}) {
            console.log('assertive');
            let storage = this.get('controller.allRelated');
            assert.equal(totalPages, 3);
            assert.equal(storage.length, 12);
        }
    });
    // Kick off event loop that ends in assertions
    let model = callModelHook(subject);
    Ember.run(() => subject.setupRelationshipFetch(subject.get('controller'), model));
});

