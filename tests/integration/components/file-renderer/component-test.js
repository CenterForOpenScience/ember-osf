import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import config from 'ember-get-config';

moduleForComponent('file-renderer', 'Integration | Component | file renderer', {
    integration: true
});

test('it renders', function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(hbs`{{file-renderer}}`);

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(hbs`
        {{#file-renderer}}
        {{/file-renderer}}
    `);

    assert.equal(this.$().text().trim(), '');
});

test('file rendering defaults', function(assert) {

    let links = {
        download:'someTruthyValue'
    };
    this.set('links', links);
    this.render(hbs`
      {{#file-renderer links=links}}
        {{/file-renderer}}
    `);

    assert.equal(this.$('iframe').attr('height'), '100%');
    assert.equal(this.$('iframe').attr('width'), '100%');
    assert.equal(this.$('iframe').attr('src'), config.OSF.renderUrl + "?url=" + encodeURIComponent(links.download + '?direct&mode=render'));
});

test('specify file rendering parameters', function(assert) {
    let links = {
        download: 'http://cos.io/',
    };
    this.set('links', links);
    this.set('height', '500');
    this.set('width', '500');

    this.render(hbs`
        {{#file-renderer links=links height=height width=width}}
        {{/file-renderer}}
    `);

    assert.equal(this.$('iframe').attr('height'), '500');
    assert.equal(this.$('iframe').attr('width'), '500');
    assert.equal(this.$('iframe').attr('src'), config.OSF.renderUrl + "?url=" + encodeURIComponent(links.download + '?direct&mode=render'));
});
