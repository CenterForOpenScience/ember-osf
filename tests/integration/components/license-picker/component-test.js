import Ember from 'ember';
import FakeServer, { stubRequest } from 'ember-cli-fake-server';
import config from 'ember-get-config';
import { moduleForComponent, test } from 'ember-qunit';


moduleForComponent('license-picker', 'Integration | Component | license picker', {
    integration: true
});

function render(ctx, args) {
    let noop = () => {};
    this.set('noop', noop);
    let licenses = [{
        name: 'Without',
        text: 'This is a license without input fields',
        requiredFields: []
    }, {
        name: 'No license',
        text: '{{yearRequired}} {{copyrightHolders}}',
        required_fields: ['yearRequired', 'copyrightHolders']
    }]
    ctx.set('licenses', licenses);
    return ctx.render(Ember.HTMLBars.compile(`{{license-picker
        ${args && args.indexOf('editLicense') === -1 ? 'editLicense=(action noop)' : ''}
        allowDismiss=false
        licenses=licenses
        pressSubmit=(action noop)
        ${args || ''}
    }}`));
}

test('it renders', function(assert) {
    render(this);
    assert.ok(true);
});

test('default values cause autosave to trigger', function(assert) {
    let called = false;
    const autosaveFunc = () => {
        called = true;
    }
    this.set('autosaveFunc', autosaveFunc);
    let currentValues = {};
    this.set('currentValues', currentValues);
    render(this, 'editLicense=autosaveFunc autosave=true currentValues=currentValues');
    assert.ok(called);
});

test('passing currentValues does not trigger autosave', function(assert) {
    let called = false;
    const autosaveFunc = () => {
        called = true;
    }
    this.set('autosaveFunc', autosaveFunc);
    let currentValues = {
        year: '2017',
        copyrightHolders: 'Henrique',
        nodeLicense: {
            id: 'a license'
        }
    };
    this.set('currentValues', currentValues);
    render(this, 'editLicense=autosaveFunc autosave=true currentValues=currentValues');
    assert.ok(!called);
});
