import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('t-plus', 'helper:t-plus', {
    integration: true,
    beforeEach() {
        let i18n = this.container.lookup('service:i18n');
        i18n.set('locale', 'en');
        Ember.run(i18n, 'addTranslations', {'general.help': 'What is a {{preprintWords.preprint}}?'});
    },

    afterEach() {
        Ember.run(this.i18n, 'destroy');
    }
});


test('it works with defaults 11', function(assert) {
    this.render(hbs`{{t-plus 'general.help'}}`);
    assert.equal(this.$().text().trim(), 'What is a preprint?');
});

test('provider wants paper 11', function(assert) {
    this.inject.service('theme');
    this.theme.set('provider', {
        preprintWord: 'paper'
    });

    this.render(hbs`{{t-plus 'general.help'}}`);
    assert.equal(this.$().text().trim(), 'What is a preprint?');
});

test('provider wants preprints 11', function(assert) {
    this.inject.service('theme');
    this.theme.set('provider', {
        preprintWord: 'preprint'
    });

    this.render(hbs`{{t-plus 'general.help'}}`);
    assert.equal(this.$().text().trim(), 'What is a preprint?');
});