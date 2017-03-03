
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';
import tHelper from "ember-i18n/helper";

/// Stub i18n service
const i18nStub = Ember.Service.extend({
    t: function(word) {
        const translated = {
            'eosf.navbar.myProjects': 'My Projects',
            'eosf.navbar.search': 'Search',
            'eosf.navbar.addAPreprint': 'Add a preprint',
            'eosf.navbar.support': 'Support',
            'eosf.navbar.browse': 'Browse'
        };
        return translated[word];
    }
});

moduleForComponent('build-secondary-navLinks', 'build-secondary-navLinks', {
    integration: true,

    beforeEach() {
    // register the helper:
    this.registry.register('helper:t', tHelper);
        this.register('service:i18n', i18nStub);
       this.inject.service('i18n', { as: 'i18n' });
  }
});

test('returns preprints service links', function(assert) {
    let session = Ember.Object.create({
        isAuthenticated: true
    });

    this.set('currentService', 'PREPRINTS');
    this.set('session', session);
        this.render(hbs`
            {{#each (build-secondary-navLinks currentService session) as |navLink|}}
                {{navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Add a preprint Search Support');
});


test('returns home service links, authenticated', function(assert) {
    let session = Ember.Object.create({
        isAuthenticated: true
    });

    this.set('currentService', 'HOME');
    this.set('session', session);
        this.render(hbs`
            {{#each (build-secondary-navLinks currentService session) as |navLink|}}
                {{navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'My Projects Search');
});


test('returns home service links, unauthenticated', function(assert) {
    let session = Ember.Object.create({
        isAuthenticated: false
    });

    this.set('currentService', 'HOME');
    this.set('session', session);
        this.render(hbs`
            {{#each (build-secondary-navLinks currentService session) as |navLink|}}
                {{navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Browse Search Support');
});

test('returns Registries service links', function(assert) {
    let session = Ember.Object.create({
        isAuthenticated: true
    });

    this.set('currentService', 'REGISTRIES');
    this.set('session', session);
        this.render(hbs`
            {{#each (build-secondary-navLinks currentService session) as |navLink|}}
                {{navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Search Support');
});

test('returns meetings service links', function(assert) {
    let session = Ember.Object.create({
        isAuthenticated: true
    });

    this.set('currentService', 'MEETINGS');
    this.set('session', session);
        this.render(hbs`
            {{#each (build-secondary-navLinks currentService session) as |navLink|}}
                {{navLink.name}}
            {{/each}}
        `);

    assert.equal(this.$()[0].innerText, 'Search');
});
