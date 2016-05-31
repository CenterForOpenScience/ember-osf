import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

/*
 * assertions:
 *  - once for expectedRequest.url
 *  - once for each key in expectedRequest.query
 *  - once for each key in expectedRequest.headers
 *  - once for each key in expectedRequest.settings
 */
function setupMockjax(assert, expectedRequest, response, freshModel) {
    Ember.$.mockjax(function(requestSettings) {
        if (requestSettings.url.startsWith(expectedRequest.url)) {
            return {
                response: function(origSettings) {
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

    if (freshModel) {
        Ember.$.mockjax({
            url: '/files/*',
            response: function() {
                this.responseText = reloadModelResponse(freshModel);
            }
        });
    }
}

// assert once for the path and once for each expected query param
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

function reloadModelResponse(models) {
    function modelToData(model) {
        let data = {
            attributes: {
                name: model.get('name'),
                kind: model.get('kind'),
                path: model.get('path'),
                size: model.get('size'),
                provider: model.get('provider'),
                dateModified: new Date() + 1,
                dateCreated: model.get('dateCreated'),
                checkout: model.get('checkout')
            },
            id: model.get('id'),
            type: 'files'
        };
        return data;
    }

    if (Array.isArray(models)) {
        return {
            data: models.map(modelToData)
        };
    } else {
        return {
            data: modelToData(models)
        };
    }
}

let fakeAccessToken = 'thisisafakeaccesstoken';
let sessionStub = Ember.Service.extend({
    data: {
        authenticated: {
            attributes: {
                accessToken: fakeAccessToken
            }
        }
    }
});

moduleFor('service:file-manager', 'Unit | Service | file manager', {
    unit: true,
    needs: ['model:file'],
    beforeEach() {
        this.register('service:session', sessionStub);
        manualSetup(this.container);
        Ember.$.mockjax.clear();
    },
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
    setupMockjax(assert, request, response);

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
    setupMockjax(assert, request, response);

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
    let freshModel = FactoryGuy.make('file', { id: file.id });
    setupMockjax(assert, request, response, freshModel);

    service.updateContents(file, request.settings.data).then(function(fresh) {
        assert.deepEqual(fresh, freshModel, 'returns updated model');
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
    setupMockjax(assert, request, response);

    service.updateContents(file, request.settings.data).then(function() {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('addSubfolder sends valid waterbutler request', function(assert) {
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
        status: 200,
    };
    let freshModel = [...folder.get('files'),
        FactoryGuy.make('file', 'isFolder', { name: request.query.name })];
    setupMockjax(assert, request, response, freshModel);

    service.addSubfolder(folder, request.query.name).then(function(data) {
        assert.equal(data, response.data);
        done();
    }).catch(function() {
        assert.ok(false, 'promise should not reject on success');
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
    setupMockjax(assert, request, response);

    service.addSubfolder(folder, request.query.name).then(function() {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function() {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('uploadFile sends valid waterbutler request', function(assert) {
    assert.expect(6);
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
    let freshModel = [...folder.get('files'),
        FactoryGuy.make('file', { name: request.query.name })];
    setupMockjax(assert, request, response, freshModel);

    service.uploadFile(file, request.query.name,
            request.settings.data).then(function(data) {
        assert.equal(data, response.data);
        done();
    }).catch(function() {
        assert.ok(false, 'promise should not reject on success');
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
    setupMockjax(assert, request, response);

    service.uploadFile(file, request.query.name,
            request.settings.data).then(function() {
        assert.ok(false, 'promise should reject on error');
        done();
    }).catch(function(error) {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('move sends valid waterbutler request', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder');
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: {
                action: 'move',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
    };
    let freshModel = [...folder.get('files'),
        FactoryGuy.make('file', { name: file.get('name') })];
    setupMockjax(assert, request, response, freshModel);

    service.move(file, folder).then(function(movedFile) {
        assert.equal(movedFile.get('id'), file.get('id'));
        done();
    }).catch(function() {
        assert.ok(false, 'promise should not reject on success');
        done();
    });
});

test('move passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder');
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: {
                action: 'move',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 402,
    };
    setupMockjax(assert, request, response);

    service.move(file, folder).then(function() {
        assert.ok(false, 'promise should reject');
        done();
    }).catch(function(error) {
        assert.ok(true, 'promise rejects on error');
        done();
    });
});

test('copy sends valid waterbutler request', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder');
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: {
                action: 'copy',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
    };
    let freshModel = [...folder.get('files'),
        FactoryGuy.make('file', { name: file.get('name') })];
    setupMockjax(assert, request, response, freshModel);

    service.copy(file, folder).then(function() {
        assert.ok(true, 'promise resolves on success');
        done();
    }).catch(function() {
        assert.ok(false, 'promise should not reject on success');
        done();
    });
});

test('copy passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = FactoryGuy.make('file');
    let folder = FactoryGuy.make('file', 'isFolder');
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.get('links').move,
        settings: { method: 'POST', data: {
                action: 'copy',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 402,
    };
    setupMockjax(assert, request, response);

    service.copy(file, folder).then(function() {
        done();
    }).catch(function(error) {
        assert.equal(error, response.statusText);
        done();
    });
});

test('rename sends valid waterbutler request', function(assert) {
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
        status: 200,
    };
    let freshModel = [...folder.get('files'),
        FactoryGuy.make('file', { name: request.settings.data.rename })];
    setupMockjax(assert, request, response, freshModel);

    service.rename(file, request.settings.data.rename).then(function(renamed) {
        assert.equal(renamed.get('id'), file.get('id'));
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
    setupMockjax(assert, request, response);

    service.rename(file, request.settings.data.rename).then(function() {
        done();
    }).catch(function(error) {
        assert.equal(error, response.statusText);
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
    setupMockjax(assert, request, response);

    service.deleteFile(file).then(function() {
        assert.ok(true);
        done();
    }).catch(function() {
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
    setupMockjax(assert, request, response);

    service.deleteFile(file).then(function() {
        done();
    }).catch(function(error) {
        assert.equal(error, response.statusText);
        done();
    });
});
