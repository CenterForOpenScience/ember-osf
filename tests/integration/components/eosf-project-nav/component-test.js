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

test('buttons for logged in non-contributor on public project', function(assert) {
    var user = FactoryGuy.make('user');
    var node = FactoryGuy.make('node', {
        public: true,
        currentUserPermissions: [permissions.READ]
    });

    this.set('user', user);
    this.set('node', node);
    this.render(hbs`{{eosf-project-nav node=node user=user}}`);

    let visible = ['Files', 'Wiki', 'Analytics', 'Registrations', 'Forks'];
    let hidden = ['Contributors', 'Settings'];
    for (let text of visible) {
        assert.ok(this.$().text().indexOf(text) !== -1, `Could not find button: ${text}`);
    }

    for (let text of hidden) {
        assert.ok(this.$().text().indexOf(text) === -1, `Found unexpected button: ${text}`);
    }
});

test('buttons for logged-in contributor on private project', function(assert) {
    var user = FactoryGuy.make('user');
    var node = FactoryGuy.make('node', {
        public: false,
        currentUserPermissions: [permissions.WRITE],
        contributors: [user]
    });

    this.set('user', user);
    this.set('node', node);
    this.render(hbs`{{eosf-project-nav node=node user=user}}`);

    let visible = ['Files', 'Wiki', 'Analytics', 'Registrations', 'Forks', 'Contributors', 'Settings'];
    for (let text of visible) {
        assert.ok(this.$().text().indexOf(text) !== -1, `Could not find button: ${text}`);
    }
});

test('hides parent button for top level node', function(assert) {
    var user = FactoryGuy.make('user');
    var node = FactoryGuy.make('node', {
        currentUserPermissions: [permissions.WRITE],
        contributors: [user]
    });

    this.set('user', user);
    this.set('node', node);
    this.render(hbs`{{eosf-project-nav node=node user=user}}`);

    assert.ok(this.$('.eosf-project-nav-parent').length === 0, `Parent button should be hidden`);

});
