import Ember from 'ember';
import {moduleFor} from 'ember-qunit';
import FactoryGuy, { manualSetup, mockUpdate } from 'ember-data-factory-guy';
import wait from 'ember-test-helpers/wait';
import test from 'ember-sinon-qunit/test-support/test';

/*
 * assertions:
 *  - once for expectedRequest.url
 *  - once for expectedRequest.query
 *  - once for each key in expectedRequest.headers
 *  - once for each key in expectedRequest.settings
 */
function mockWaterbutler(assert, expectedRequest, response) {
    Ember.$.mockjax(function (requestSettings) {
        if (requestSettings.url.indexOf(expectedRequest.url) === 0) {
            return {
                response: function () {
                    assertURL(assert, requestSettings.url,
                        expectedRequest.url, expectedRequest.query);
                    assertHeaders(assert, requestSettings.headers,
                        expectedRequest.headers);
                    assertSettings(assert, requestSettings,
                        expectedRequest.settings);
                    this.responseText = response.data || {};
                    this.status = response.status;
                }
            };
        }
        return;
    });
}

// assert once for the path and once if queryParams is specified
function assertURL(assert, actual, expected, queryParams) {
    if (!queryParams) {
        assert.equal(actual, expected, 'correct request URL');
        return;
    }
    let [actualBase, actualParams] = actual.split('?');
    assert.equal(actualBase, expected, 'correct base URL');

    let expectedParams = [];
    for (let key in queryParams) {
        expectedParams.push(`${key}=${queryParams[key]}`);
    }
    assert.deepEqual(actualParams.split('&').sort(), expectedParams.sort(),
        'correct query params');
}

// assert once for each expected header
function assertHeaders(assert, actual, expected) {
    for (let header in expected) {
        assert.equal(actual[header], expected[header],
            `request has expected header '${header}'`);
    }
}

// assert once for each expected ajax setting
function assertSettings(assert, actual, expected) {
    for (let s in expected) {
        // Check for a JSON payload
        if (typeof expected[s] === 'object' &&
            typeof actual[s] === 'string') {
            let payload = JSON.parse(actual[s]);
            assert.deepEqual(payload, expected[s],
                `request has expected JSON payload '${s}'`);
        } else {
            assert.equal(actual[s], expected[s],
                `request has expected option '${s}'`);
        }
    }
}


let fakeAccessToken = 'thisisafakeaccesstoken';
let fakeUserID = 'thisisafakeuseridbanana';
let sessionStub = Ember.Service.extend({
    authorize(_, setHeader) {
        setHeader('Authorization', `Bearer ${fakeAccessToken}`);
    },
    data: {
        authenticated: {
            id: fakeUserID
        }
    }
});

moduleFor('service:file-manager', 'Unit | Service | file manager', {
    unit: true,
    needs: [
        'model:file', 'model:file-version', 'model:comment', 'model:node',
        'transform:links', 'transform:embed', 'transform:fixstring', 'model:user'
    ],
    beforeEach() {
        this.register('service:session', sessionStub);

        // FactoryGuy setup
        manualSetup(this.container);
    }
});

test('test waterbutler request', function (assert) {
    this.inject.service('session');
    assert.expect(4);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').download,
        settings: {method: 'GET'},
        headers: {Authorization: `Bearer ${fakeAccessToken}`}
    };
    let response = {
        status: 200,
        data: 'file contents here'
    };
    mockWaterbutler(assert, request, response);

    service._waterbutlerRequest('GET', request.url).then(function (data) {
        assert.equal(data, response.data);
        done();
    }).catch(function () {
        assert.ok(false, 'promise should not reject on success');
        done();
    });
});

test('getContents sends valid waterbutler request', function (assert) {
    assert.expect(2);

    const service = this.subject();
    const file = FactoryGuy.make('file');

    const request = {
        url: file.get('links').download,
        settings: {method: 'GET'},
        headers: {Authorization: `Bearer ${fakeAccessToken}`}
    };

    const stub = this.stub(service, '_waterbutlerRequest');

    service.getContents(file);

    assert.ok(stub.calledOnce, '_waterbutlerRequest was called once');

    assert.ok(stub.calledWithExactly('GET', request.url, {}), '_waterbutlerRequest was called with correct parameters');
});


test('updateContents sends valid waterbutler request', function (assert) {
    assert.expect(2);

    let service = this.subject();
    let file = FactoryGuy.make('file');

    let request = {
        url: file.get('links').upload,
        query: {kind: 'file'},
        settings: {method: 'PUT', data: 'contents contents'},
        headers: {Authorization: `Bearer ${fakeAccessToken}`},
    };
    let response = {
        status: 200,
    };

    service.set('_waterbutlerRequest', () => {
        return new Ember.RSVP.Promise(function(resolve){
            // succeed
            resolve(response);
        });
    });

    const stub = this.stub(service, '_reloadModel');

    service.updateContents(file, request.settings.data);

    return wait().then(() => {
        assert.ok(stub.calledOnce, '_reloadModel was called once');
        assert.ok(stub.calledWithExactly(file), '_reloadModel was called with correct parameters');
    });
});


test('addSubfolder sends valid waterbutler request', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let folder = FactoryGuy.make('file', 'isFolder');

    let request = {
        url: folder.get('links').new_folder,
        query: {name: 'fooname', kind: 'folder'},
        settings: {method: 'PUT'},
        headers: {Authorization: `Bearer ${fakeAccessToken}`},
    };
    let response = {
        status: 200,
    };

    service.set('_waterbutlerRequest', () => {
        return new Ember.RSVP.Promise(function(resolve){
            // succeed
            resolve(response);
        });
    });

    const stub = this.stub(service, '_getNewFileInfo');

    service.addSubfolder(folder, request.query.name);

    return wait().then(() => {
        assert.ok(stub.calledOnce, '_getNewFileInfo was called once');
        assert.ok(stub.calledWithExactly(folder, request.query.name), '_getNewFileInfo was called with correct parameters');
    });

});


test('uploadFile sends valid waterbutler request', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let folder = FactoryGuy.make('file', 'isFolder');

    let request = {
        url: folder.get('links').upload,
        query: {name: 'fooname', kind: 'file'},
        settings: {method: 'PUT', data: 'contents contents'},
        headers: {Authorization: `Bearer ${fakeAccessToken}`},
    };
    let response = {
        status: 200,
    };

    service.set('_waterbutlerRequest', () => {
        return new Ember.RSVP.Promise(function(resolve){
            // succeed
            resolve(response);
        });
    });

    const stub = this.stub(service, '_getNewFileInfo');

    service.uploadFile(folder, request.query.name, request.settings.data);

    return wait().then(() => {
        assert.ok(stub.calledOnce, '_getNewFileInfo was called once');
        assert.ok(stub.calledWithExactly(folder, request.query.name), '_getNewFileInfo was called with correct parameters');
    });
});


test('move sends valid waterbutler request', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder', {path: '/path/path/this/is/a/path/'});

    let response = {
        status: 200,
        data: {
            attributes: {name: file.get('name')}
        }
    };

    service.set('_waterbutlerRequest', () => {
        return new Ember.RSVP.Promise(function(resolve){
            // succeed
            resolve(response);
        });
    });

    const stub = this.stub(service, '_getNewFileInfo');

    service.move(file, folder);

    return wait().then(() => {
        assert.ok(stub.calledOnce, '_getNewFileInfo was called once');
        assert.ok(stub.calledWithExactly(folder, response.data.attributes.name), '_getNewFileInfo was called with correct parameters');
    });

});


test('copy sends valid waterbutler request', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder', {path: '/path/path/this/is/a/path/'});

    let response = {
        status: 200,
        data: {
            attributes: {name: file.get('name')}
        }
    };

    service.set('_waterbutlerRequest', () => {
        return new Ember.RSVP.Promise(function(resolve){
            // succeed
            resolve(response);
        });
    });

    const stub = this.stub(service, 'move');

    service.copy(file, folder);

    assert.ok(stub.calledOnce, 'move was called once');

    const options = { data: {action: 'copy'}};

    assert.ok(stub.calledWithExactly(file, folder, options), 'move was called with correct parameters');
});


test('rename sends valid waterbutler request', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let file = FactoryGuy.make('file');

    let request = {
        url: file.get('links').move,
        settings: {method: 'POST', data: {action: 'rename', rename: 'flooby'}},
        headers: {Authorization: `Bearer ${fakeAccessToken}`},
    };
    let response = {
        status: 200,
    };

    service.set('_waterbutlerRequest', () => {
        return new Ember.RSVP.Promise(function(resolve){
            // succeed
            resolve(response);
        });
    });

    const stub = this.stub(service, '_reloadModel');

    service.rename(file, request.settings.data.rename);

    return wait().then(() => {
        assert.ok(stub.calledOnce, '_reloadModel was called once');
        assert.ok(stub.calledWithExactly(file), '_reloadModel was called with correct parameters');
    });
});


test('deleteFile sends valid waterbutler request', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let folder = FactoryGuy.make('file', 'isFolder');
    let file1 = FactoryGuy.make('file', {parentFolder: folder});

    let response = {
        status: 200,
    };

    service.set('_waterbutlerRequest', () => {
        return new Ember.RSVP.Promise(function(resolve){
            // succeed
            resolve(response);
        });
    });

    const stub = this.stub(service, '_reloadModel');

    service.deleteFile(file1);

    return wait().then(() => {
        assert.ok(stub.calledOnce, '_reloadModel was called once');
        assert.ok(stub.calledWithExactly(folder.get('files')), '_reloadModel was called with correct parameters');
    });
});


test('checkOut checks out', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    assert.equal(file.get('checkout'), null, 'file starts with null checkout');

    mockUpdate(file);
    service.checkOut(file).then(() => {
        assert.equal(file.get('checkout'), fakeUserID, 'file.checkout set');
        done();
    });
});

test('checkIn checks in', function (assert) {
    assert.expect(2);
    let service = this.subject();
    let file = FactoryGuy.make('file', {checkout: fakeUserID});
    let done = assert.async();

    assert.equal(file.get('checkout'), fakeUserID, 'file.checkout already set');

    mockUpdate(file);
    service.checkIn(file).then(() => {
        assert.equal(file.get('checkout'), null, 'file.checkout null after check-in');
        done();
    });
});

test('checkOut fails on checked-out file', function (assert) {
    assert.expect(1);
    let service = this.subject();
    let file = FactoryGuy.make('file', {checkout: 'someoneelse'});
    let done = assert.async();

    mockUpdate(file).fails({status: 403});
    service.checkIn(file).catch(() => {
        assert.equal(file.get('checkout'), 'someoneelse', 'file.checkout unaffected by failure');
        done();
    });
});
