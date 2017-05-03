import Ember from 'ember';

import { moduleForComponent, skip } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import FactoryGuy, { manualSetup } from 'ember-data-factory-guy';

import permissions from 'ember-osf/const/permissions';

moduleForComponent('eosf-project-nav', 'Integration | Component | eosf project nav', {
    integration: true,
    beforeEach: function() {
        manualSetup(this.container);
    }
});


skip('buttons for logged in non-contributor on public project', function(assert) {
    var user = FactoryGuy.make('user');
    var node = FactoryGuy.make('node', {
        public: true,
        currentUserPermissions: [permissions.READ]
    });

    // Hack: bypass the computed value to avoid an unnecessary server call
    node.isContributor = () => new Ember.RSVP.Promise((resolve) => resolve(false));

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

skip('buttons for logged-in contributor on private project', function(assert) {
    var user = FactoryGuy.make('user');
    var node = FactoryGuy.make('node', {
        public: false,
        currentUserPermissions: [permissions.WRITE]
    });

    // Hack: bypass the computed value to avoid an unnecessary server call
    node.isContributor = () => new Ember.RSVP.Promise((resolve) => resolve(true));

    this.set('user', user);
    this.set('node', node);

    this.render(hbs`{{eosf-project-nav node=node user=user}}`);

    let visible = ['Files', 'Wiki', 'Analytics', 'Registrations', 'Forks', 'Contributors', 'Settings'];
    for (let text of visible) {
        assert.ok(this.$().text().indexOf(text) !== -1, `Could not find button: ${text}`);
    }
});

skip('hides parent button for top level node', function(assert) {
    var user = FactoryGuy.make('user');
    var node = FactoryGuy.make('node', {
        currentUserPermissions: [permissions.WRITE]
    });

    this.set('user', user);
    this.set('node', node);
    this.render(hbs`{{eosf-project-nav node=node user=user}}`);

    assert.ok(this.$('.eosf-project-nav-parent').length === 0, `Parent button should be hidden`);

});
