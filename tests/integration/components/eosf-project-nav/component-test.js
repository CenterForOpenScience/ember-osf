import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

import permissions from 'ember-osf/const/permissions';

moduleForComponent('eosf-project-nav', 'Integration | Component | eosf project nav', {
    integration: true,
    beforeEach: function() {
        manualSetup(this.container);
    }
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    assert.expect(1);

    var user = FactoryGuy.make('user');
    var node = FactoryGuy.make('node', {
        currentUserPermissions: [permissions.WRITE],
        contributors: [user]
    });
    this.set('user', user);
    this.set('node', node);
    this.render(hbs`{{eosf-project-nav node=node user=user}}`);

    // TOOD: Test more combinations of node, registration, pub/private; verify buttons show when expected
    assert.ok(this.$().text().indexOf('Component Navigation') !== -1);
});
