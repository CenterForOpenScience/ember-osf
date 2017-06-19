import { tPlus } from 'dummy/helpers/t-plus';
import { module, test } from 'qunit';

module('Unit | Helper | t plus');


test('it works with defaults 11', function(assert) {
    i18n = this.container.lookup('service:i18n');
    i18n.addTranslations('en', {'general.help': 'What is a {{preprintWords.preprint}}?'});

    let result = tPlus('general.help');
    assert.equal(result, 'What is a preprint?');
});

test('provider wants paper 11', function(assert) {
    theme = this.container.lookup('service:theme');
    theme.set('provider', {
        preprintWord: 'paper'
    });
    i18n = this.container.lookup('service:i18n');
    i18n.addTranslations('en', {'general.help': 'What is a {{preprintWords.preprint}}?'});

    let result = tPlus('general.help');
    assert.equal(result, 'What is a paper?');
});

test('provider wants preprints 11', function(assert) {
    theme = this.container.lookup('service:theme');
    theme.set('provider', {
        preprintWord: 'preprint'
    });
    i18n = this.container.lookup('service:i18n');
    i18n.addTranslations('en', {'general.help': 'What are {{preprintWords.Preprints}}?'});

    let result = tPlus('general.help');
    assert.equal(result, 'What are Preprints?');
});
