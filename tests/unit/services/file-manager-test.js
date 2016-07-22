import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import FactoryGuy, { manualSetup, mockSetup, mockUpdate,
    mockTeardown, mockFind, mockReload } from 'ember-data-factory-guy';

/*
 * assertions:
 *  - once for expectedRequest.url
 *  - once for expectedRequest.query
 *  - once for each key in expectedRequest.headers
 *  - once for each key in expectedRequest.settings
 */
function mockWaterbutler(assert, expectedRequest, response) {
    Ember.$.mockjax(function(requestSettings) {
        if (requestSettings.url.indexOf(expectedRequest.url) === 0) {
            return {
                response: function() {
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
    for(let key in queryParams) {
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
        'transform:links', 'transform:embed'
    ],
    beforeEach() {
        this.register('service:session', sessionStub);

        // FactoryGuy setup
        manualSetup(this.container);
        mockSetup();
    },
    afterEach() {
        mockTeardown();
    }
});

test('getContents sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').download,
        settings: { method: 'GET' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` }
    };
    let response = {
        status: 200,
        data: 'file contents here'
    };
    mockWaterbutler(assert, request, response);

    service.getContents(file).then(function(data) {
        assert.equal(data, response.data);
        done();
    }).catch(function() {
        assert.ok(false, 'promise should not reject on success');
        done();
    });
});

test('getContents passes along error', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').download,
        settings: { method: 'GET' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` }
    };
    let response = {
        status: 404
    };
    mockWaterbutler(assert, request, response);

    service.getContents(file).then(function() {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('updateContents sends valid waterbutler request', function(assert) {
    assert.expect(6);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').upload,
        query: { kind: 'file' },
        settings: { method: 'PUT', data: 'contents contents' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
    };
    let freshModel = FactoryGuy.build('file', { id: file.id,
                                      dateModified: new Date() });
    mockFind('file', file.id).returns({json:freshModel});

    mockWaterbutler(assert, request, response);

    service.updateContents(file, request.settings.data).then(function(fresh) {
        assert.equal(fresh.get('id'), file.get('id'));
        done();
    }).catch(function() {
        assert.ok(false, 'promise should not reject on success');
        done();
    });
});

test('updateContents passes along error', function(assert) {
    assert.expect(6);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').upload,
        query: { kind: 'file' },
        settings: { method: 'PUT', data: 'contents contents' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 404,
    };
    mockWaterbutler(assert, request, response);

    service.updateContents(file, request.settings.data).then(function() {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('addSubfolder sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let folder = FactoryGuy.make('file', 'isFolder');
    let done = assert.async();

    let request = {
        url: folder.get('links').new_folder,
        query: { name: 'fooname', kind: 'folder' },
        settings: { method: 'PUT' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
    };
    mockWaterbutler(assert, request, response);

    let p = service.addSubfolder(folder, request.query.name);

    p.then(function() {
        done();
    }).catch(function() {
        done();
    });
});

test('addSubfolder passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let folder = FactoryGuy.make('file', 'isFolder');
    let done = assert.async();

    let request = {
        url: folder.get('links').new_folder,
        query: { name: 'fooname', kind: 'folder' },
        settings: { method: 'PUT' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 404,
    };
    mockWaterbutler(assert, request, response);

    service.addSubfolder(folder, request.query.name).then(function() {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('uploadFile sends valid waterbutler request', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let folder = FactoryGuy.make('file', 'isFolder');
    let done = assert.async();

    let request = {
        url: folder.get('links').upload,
        query: { name: 'fooname', kind: 'file' },
        settings: { method: 'PUT', data: 'contents contents' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
    };
    mockWaterbutler(assert, request, response);

    let p = service.uploadFile(folder, request.query.name,
                               request.settings.data);

    p.then(function() {
        done();
    }).catch(function() {
        done();
    });
});

test('uploadFile passes along error', function(assert) {
    assert.expect(6);
    let service = this.subject();
    let file = FactoryGuy.make('file', 'isFolder');
    let done = assert.async();

    let request = {
        url: file.get('links').upload,
        query: { name: 'fooname', kind: 'file' },
        settings: { method: 'PUT', data: 'contents contents' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 401,
    };
    mockWaterbutler(assert, request, response);

    service.uploadFile(file, request.query.name,
            request.settings.data).then(function() {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('move sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder',
                                 { path: '/path/path/this/is/a/path/' });
    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: {
                action: 'move',
                path: folder.get('path'),
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        data: {
            data: {
                attributes: { name: file.get('name') }
            }
        }
    };
    mockWaterbutler(assert, request, response);

    let p = service.move(file, folder);

    p.then(function() {
        done();
    }).catch(function() {
        done();
    });
});

test('move passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder',
                                 { path: '/path/path/this/is/a/path/' });

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: {
                action: 'move',
                path: folder.get('path'),
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 402,
    };
    mockWaterbutler(assert, request, response);

    service.move(file, folder).then(function() {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('copy sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder',
                                 { path: '/path/path/this/is/a/path/' });

    let request = {
        url: file.get('links').move,
        settings: {
            method: 'POST',
            data: {
                action: 'copy',
                path: folder.get('path'),
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        data: {
            data: {
                attributes: { name: file.get('name') }
            }
        }
    };
    mockWaterbutler(assert, request, response);

    let p = service.copy(file, folder);

    p.then(function() {
        done();
    }).catch(function() {
        done();
    });
});

test('copy passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder',
                                 { path: '/path/path/this/is/a/path/' });

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: {
                action: 'copy',
                path: folder.get('path'),
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 402,
    };
    mockWaterbutler(assert, request, response);

    service.copy(file, folder).then(function() {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('rename sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: { action: 'rename', rename: 'flooby' } },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
    };

    mockWaterbutler(assert, request, response);
    mockReload(file).returns({
        json: FactoryGuy.build('file', {
            id: file.get('id'),
            name: request.settings.data.rename
        })
    });

    let p = service.rename(file, request.settings.data.rename);

    p.then(function() {
        done();
    }).catch(function() {
        done();
    });
});

test('rename passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: { action: 'rename', rename: 'flooby' } },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 401,
    };
    mockWaterbutler(assert, request, response);

    service.rename(file, request.settings.data.rename).then(function() {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('deleteFile sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').delete,
        settings: { method: 'DELETE' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
    };
    mockWaterbutler(assert, request, response);

    service.deleteFile(file).then(function() {
        assert.ok(true);
        done();
    }).catch(function() {
        assert.ok(false, 'promise rejected!');
        done();
    });
});

test('deleteFile passes along error', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = FactoryGuy.make('file');
    let done = assert.async();

    let request = {
        url: file.get('links').delete,
        settings: { method: 'DELETE' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 401,
    };
    mockWaterbutler(assert, request, response);

    service.deleteFile(file).then(function() {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('checkOut checks out', function(assert) {
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

test('checkIn checks in', function(assert) {
    assert.expect(2);
    let service = this.subject();
    let file = FactoryGuy.make('file', { checkout: fakeUserID });
    let done = assert.async();

    assert.equal(file.get('checkout'), fakeUserID, 'file.checkout already set');

    mockUpdate(file);
    service.checkIn(file).then(() => {
        assert.equal(file.get('checkout'), null, 'file.checkout null after check-in');
        done();
    });
});

test('checkOut fails on checked-out file', function(assert) {
    assert.expect(1);
    let service = this.subject();
    let file = FactoryGuy.make('file', { checkout: 'someoneelse' });
    let done = assert.async();

    mockUpdate(file).fails({ status: 403 });
    service.checkIn(file).catch(() => {
        assert.equal(file.get('checkout'), 'someoneelse', 'file.checkout unaffected by failure');
        done();
    });
});
