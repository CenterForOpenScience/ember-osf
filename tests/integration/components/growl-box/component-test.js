import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('growl-box', 'Integration | Component | growl box', {
    integration: true,
    beforeEach() {
        this.inject.service('growler');
    },
    afterEach() {
        Ember.run.next(() => {
            this.get('growler').clean();
        });
    }
});
//will not test for self-removal, all growls will be permanent to prevent

test('default growl', function(assert) {

    this.render(hbs`{{growl-box}}`);
    assert.equal(this.$().text().trim(), '');
    Ember.run(() => {
        this.get('growler').growl();
        Ember.run.next(() => {
            this.render(hbs`{{growl-box}}`);
            assert.equal(this.$().text().trim(), 'Something went wrong.');
            assert.ok(this.$().html().indexOf('alert-danger') !== -1);
            assert.ok(this.$().html().indexOf('close') !== -1);
        });
    });
});

test('pass in success class', function(assert) {

    Ember.run(() => {
        this.get('growler').growl({
            type: 'success'
        });
        Ember.run.next(() => {
            this.render(hbs`{{growl-box}}`);
            assert.ok(this.$().html().indexOf('alert-success') !== -1);
        });
    });
});

test('pass in message', function(assert) {

    Ember.run(() => {
        this.get('growler').growl({
            message: 'Wow that sure is mediocre!'
        });
        Ember.run.next(() => {
            this.render(hbs`{{growl-box}}`);
            assert.equal(this.$().text().trim(), 'Wow that sure is mediocre!');
        });
    });
});

test('make it dissapear instantaneously', function(assert) {

    Ember.run(() => {
        this.get('growler').growl({
            timer: 1
        });
        Ember.run.later(() => {
            this.render(hbs`{{growl-box}}`);
            assert.equal(this.$().text().trim(), '');
        }, 2);
    });
});

test('make it non-dismissable', function(assert) {

    Ember.run(() => {
        this.get('growler').growl({
            dismissable: false
        });
        Ember.run.next(() => {
            this.render(hbs`{{growl-box}}`);
            assert.ok(this.$().html().indexOf('close') === -1);
        });
    });
});
