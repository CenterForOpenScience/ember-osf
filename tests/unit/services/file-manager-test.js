import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';

function getFakeFile() {
    return Ember.Object.create({
        id: 'blip',
        links: {
            download: '/this/is/a/download/url',
            upload: '/this/is/an/upload/url',
            new_folder: '/this/is/a/new_folder/url',
            move: '/this/is/a/move/url',
            delete: '/this/is/a/delete/url'
        }
    });
}

let ajaxOptionsHandler = null;
let ajaxTransport = null;

function setupAjax(assert, expectedRequest, response) {
    // Whenever $.ajax() is called, instead of actually sending anything just
    // check the request matches what's expected, then
    // pretend a server responded with the given response.
    // Asserts once for each provided option and header, plus once for the
    // URL and once more if query params are expected

    ajaxOptionsHandler = function(options) {
        assertURL(assert, options.url, expectedRequest.url,
                expectedRequest.query);

        for (let o in expectedRequest.options) {
            // Check for a JSON payload
            if (typeof expectedRequest.options[o] === 'object' &&
                    typeof options[o] === 'string') {
                let payload = JSON.parse(options[o]);
                assert.deepEqual(payload, expectedRequest.options[o],
                        `request has expected JSON payload '${o}'`);
            } else {
                assert.equal(options[o], expectedRequest.options[o],
                        `request has expected option '${o}'`);
            }
        }
    };

    ajaxTransport = function(headers, callback) {
        for (let h in expectedRequest.headers) {
            assert.equal(headers[h], expectedRequest.headers[h],
                    `request has expected header '${h}'`);
        }
        callback(response.status, response.statusText, { text: response.data });
    };
}

// asserts once for the base URL and once more if queryParams are given
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
    needs: ['model:file', 'model:file-version', 'model:comment'],
    beforeSetup() {
        Ember.$.ajaxTransport('+*', function(options) {
            if (ajaxOptionsHandler) {
                ajaxOptionsHandler(options);
            }
            if (ajaxTransport) {
                return {
                    send: ajaxTransport,
                    abort() {}
                };
            }
        });
    },
    beforeEach() {
        this.register('service:session', sessionStub);
    },
    afterEach() {
        ajaxOptionsHandler = null;
        ajaxTransport = null;
    },
});

test('getContents sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.download,
        options: { method: 'GET' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` }
    };
    let response = {
        status: 200,
        statusText: 'ok',
        data: 'file contents here'
    };
    setupAjax(assert, request, response);

    service.getContents(file).then(function(data) {
        assert.equal(data, response.data);
        done();
    }).catch(function() {
        done();
    });
});

test('getContents passes along error', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.download,
        options: { method: 'GET' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` }
    };
    let response = {
        status: 404,
        statusText: 'missing!'
    };
    setupAjax(assert, request, response);

    service.getContents(file).then(function() {
        done();
    }).catch(function(message) {
        assert.equal(message, response.statusText, 'correct error message');
        done();
    });
});

test('updateContents sends valid waterbutler request', function(assert) {
    assert.expect(6);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.upload,
        query: { kind: 'file' },
        options: { method: 'PUT', data: 'contents contents!' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        statusText: 'ok'
    };
    setupAjax(assert, request, response);

    service.updateContents(file, request.options.data).then(function(data) {
        assert.equal(data, response.data);
        done();
    }).catch(function() {
        done();
    });
});

test('updateContents passes along error', function(assert) {
    assert.expect(6);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.upload,
        query: { kind: 'file' },
        options: { method: 'PUT', data: 'contents contents' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 404,
        statusText: 'missing!'
    };
    setupAjax(assert, request, response);

    service.updateContents(file, request.options.data).then(function() {
        done();
    }).catch(function(message) {
        assert.equal(message, response.statusText);
        done();
    });
});

test('addSubfolder sends valid waterbutler request', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.new_folder,
        query: { name: 'fooname', kind: 'folder' },
        options: { method: 'PUT' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        statusText: 'ok'
    };
    setupAjax(assert, request, response);

    service.addSubfolder(file, request.query.name).then(function(data) {
        assert.equal(data, response.data);
        done();
    }).catch(function() {
        done();
    });
});

test('addSubfolder passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.new_folder,
        query: { name: 'fooname', kind: 'folder' },
        options: { method: 'PUT' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 404,
        statusText: 'missing!'
    };
    setupAjax(assert, request, response);

    service.addSubfolder(file, request.query.name).then(function() {
        done();
    }).catch(function(message) {
        assert.equal(message, response.statusText, 'correct error message');
        done();
    });
});

test('uploadFile sends valid waterbutler request', function(assert) {
    assert.expect(6);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.upload,
        query: { name: 'fooname', kind: 'file' },
        options: { method: 'PUT', data: 'contents contents' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        statusText: 'ok'
    };
    setupAjax(assert, request, response);

    service.uploadFile(file, request.query.name,
            request.options.data).then(function(data) {
        assert.equal(data, response.data);
        done();
    }).catch(function() {
        done();
    });
});

test('uploadFile passes along error', function(assert) {
    assert.expect(6);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.upload,
        query: { name: 'fooname', kind: 'file' },
        options: { method: 'PUT', data: 'contents contents' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 401,
        statusText: 'bad'
    };
    setupAjax(assert, request, response);

    service.uploadFile(file, request.query.name,
            request.options.data).then(function() {
        done();
    }).catch(function(error) {
        assert.equal(error, response.statusText);
        done();
    });
});

test('move sends valid waterbutler request', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = getFakeFile();
    let folder = getFakeFile();
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.links.move,
        options: { method: 'POST', data: {
                action: 'move',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        statusText: 'ok',
        data: {
            data: {
                attributes: {}
            }
        }
    };
    setupAjax(assert, request, response);

    service.move(file, folder).then(function(movedFile) {
        assert.equal(movedFile.get('id'), file.get('id'));
        done();
    }).catch(function() {
        done();
    });
});

test('move passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = getFakeFile();
    let folder = getFakeFile();
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.links.move,
        options: { method: 'POST', data: {
                action: 'move',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 402,
        statusText: 'oh no'
    };
    setupAjax(assert, request, response);

    service.move(file, folder).then(function() {
        done();
    }).catch(function(error) {
        assert.equal(error, response.statusText);
        done();
    });
});

test('copy sends valid waterbutler request', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = getFakeFile();
    let folder = getFakeFile();
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.links.move,
        options: { method: 'POST', data: {
                action: 'copy',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        statusText: 'ok',
        data: {
            data: {
                attributes: {}
            }
        }
    };
    setupAjax(assert, request, response);

    service.copy(file, folder).then(function() {
        assert.ok(true);
        done();
    }).catch(function() {
        done();
    });
});

test('copy passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let done = assert.async();
    let file = getFakeFile();
    let folder = getFakeFile();
    folder.set('path', '/path/path/this/is/a/path/');

    let request = {
        url: file.links.move,
        options: { method: 'POST', data: {
                action: 'copy',
                path: folder.get('path'),
                conflict: 'replace'
            }
        },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 402,
        statusText: 'oh no'
    };
    setupAjax(assert, request, response);

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
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.move,
        options: { method: 'POST', data: { action: 'rename', rename: 'flooby' } },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        statusText: 'ok',
        data: {
            data: {
                attributes: {}
            }
        }
    };
    setupAjax(assert, request, response);

    service.rename(file, request.options.data.rename).then(function(renamed) {
        assert.equal(renamed.get('id'), file.get('id'));
        done();
    }).catch(function() {
        done();
    });
});

test('rename passes along error', function(assert) {
    assert.expect(5);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.move,
        options: { method: 'POST', data: { action: 'rename', rename: 'flooby' } },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 401,
        statusText: 'bad'
    };
    setupAjax(assert, request, response);

    service.rename(file, request.options.data.rename).then(function() {
        done();
    }).catch(function(error) {
        assert.equal(error, response.statusText);
        done();
    });
});

test('deleteFile sends valid waterbutler request', function(assert) {
    assert.expect(4);
    let service = this.subject();
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.delete,
        options: { method: 'DELETE' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 200,
        statusText: 'ok'
    };
    setupAjax(assert, request, response);

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
    let file = getFakeFile();
    let done = assert.async();

    let request = {
        url: file.links.delete,
        options: { method: 'DELETE' },
        headers: { Authorization: `Bearer ${fakeAccessToken}` },
    };
    let response = {
        status: 401,
        statusText: 'bad'
    };
    setupAjax(assert, request, response);

    service.deleteFile(file).then(function() {
        done();
    }).catch(function(error) {
        assert.equal(error, response.statusText);
        done();
    });
});
