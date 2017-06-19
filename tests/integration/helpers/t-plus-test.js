import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('t-plus', 'helper:t-plus', {
    integration: true,
    beforeEach() {
        let i18n = this.i18n = this.container.lookup('service:i18n');
        i18n.set('locale', 'en');
        Ember.run(i18n, 'addTranslations', 'en', {'general.help': 'What is a {{preprintWords.preprint}}?'});
        this.theme = this.container.lookup('service:theme');
    },

    afterEach() {
        Ember.run(this.i18n, 'destroy');
        Ember.run(this.theme, 'destroy');
    }
});


test('t-plus it works with defaults', function(assert) {
    this.render(hbs`{{t-plus 'general.help'}}`);
    assert.equal(this.$().text().trim(), 'What is a preprint?');
});

test('t-plus, provider wants paper', function(assert) {
    this.get('theme').set('provider', {
        preprintWord: 'paper'
    });

    this.render(hbs`{{t-plus 'general.help'}}`);
    assert.equal(this.$().text().trim(), 'What is a paper?');
});

test('t-plus, provider wants preprints', function(assert) {
    this.theme.set('provider', {
        preprintWord: 'preprint'
    });

    this.render(hbs`{{t-plus 'general.help'}}`);
    assert.equal(this.$().text().trim(), 'What is a preprint?');
});