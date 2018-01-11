import Ember from 'ember';
import { moduleForModel, test } from 'ember-qunit';

moduleForModel('osf-model', 'Unit | Model | osf model', {
  // Specify the other units that are required for this test.
  needs: ['model:user', 'model:node']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('queryHasMany works', function(assert) {
    const store = this.store();
    const userId = 'guid1';
    const userNodesUrl = `https://api.osf.io/v2/users/${userId}/nodes/`;
    const userPayload = `{
	"data": {
	    "relationships": {
		"nodes": {
		    "links": {
			"related": {
			    "href": "${userNodesUrl}",
			    "meta": {}
			}
		    }
		},
	    },
	    "links": {
		"self": "https://api.osf.io/v2/users/${userId}/",
		"html": "https://osf.io/${userId}/",
	    },
	    "attributes": {
		"family_name": "Guid",
		"given_name": "A",
		"full_name": "A Guid",
	    },
	    "type": "users",
	    "id": "${userId}"
	},
    }`;
    store.pushPayload(userPayload);

    const nodeIds = ['guid2', 'guid3', 'guid4']
    const nodeJson = [];
    for (const id in nodeIds) {
        nodeJson.pushObject(`{
            "links": {
                "self": "https://api.osf.io/v2/nodes/${id}/",
                "html": "https://osf.io/${id}/"
            },
            "attributes": {
                "category": "project",
                "title": "Project with guid ${id}",
            },
            "type": "nodes",
            "id": "${id}"
        }`);
    }

    const queryParams = {'param': 7};

    Ember.$.mockjax({
        url: userNodesUrl,
        responseText: `{
            "data": [
                ${nodeJson.join()}
            ],
            "meta": {
                "total": ${nodeIds.length},
            },
            "links": {
                "self": "https://api.osf.io/v2/users/${userId}/nodes/",
            }
        }`
    });

    assert.expect(3 + nodeIds.length);

    const user = store.peekRecord('user', userId);
    assert.ok(!!user);
    assert.equal(user.get('id'), userId);
    return user.queryHasMany('nodes', queryParams).then(function(nodes) {
        assert.equal(nodes.length, nodeIds.length);
        for (let i = 0; i < nodes.length; i++) {
            assert.equal(nodes[i].get('id'), nodeIds[i]);
        }
    });
});
