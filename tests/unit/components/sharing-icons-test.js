import Ember from 'ember';
import { moduleFor, test } from 'ember-qunit';
import trunc from 'npm:unicode-byte-truncate';

moduleFor('component:sharing-icons', 'Unit | Component | sharing-icons', {
    needs: [
        'model:review-action',
        'model:file',
        'model:file-version',
        'model:comment',
        'model:node',
        'model:preprint',
        'model:preprint-provider',
        'model:institution',
        'model:contributor',
        'model:file-provider',
        'model:registration',
        'model:draft-registration',
        'model:log',
        'model:user',
        'model:citation',
        'model:license',
        'model:wiki',
        'model:taxonomy',
        'service:metrics',
        'service:theme'
    ]
});

test('twitterHref computed property', function (assert) {
    const ctrl = this.subject();

    Ember.run(() => {
        const location = encodeURIComponent(window.location.href);

        ctrl.set('hyperlink', window.location.href);
        ctrl.set('title', 'test title');

        assert.strictEqual(
            ctrl.get('twitterHref'),
            `https://twitter.com/intent/tweet?url=${location}&text=test+title&via=OSFramework`
        );
    });
});

test('facebookHref computed property - has facebookAppId', function (assert) {
    const ctrl = this.subject();
    const facebookAppId = 112233445566;

    Ember.run(() => {
        const location = encodeURIComponent(window.location.href);

        ctrl.set('hyperlink', window.location.href);
        ctrl.set('title', 'test title');
        ctrl.set('facebookAppId', facebookAppId);

        assert.strictEqual(
            ctrl.get('facebookHref'),
            `https://www.facebook.com/dialog/share?app_id=${facebookAppId.toString()}&display=popup&href=${location}&redirect_uri=${location}`
        );
    });
});

test('facebookHref computed property - does not have facebookAppId returns null', function(assert) {
    const ctrl = this.subject();

    Ember.run(() => {
        ctrl.set('hyperlink', window.location.href);
        ctrl.set('title', 'test title');

        assert.strictEqual(ctrl.get('facebookHref'), null);
    });
});

test('linkedinHref computed property', function (assert) {
    const ctrl = this.subject();

    Ember.run(() => {
        const location = encodeURIComponent(window.location.href);

        ctrl.set('hyperlink', window.location.href);
        ctrl.set('title', 'test title');
        ctrl.set('description', 'test description');

        assert.strictEqual(
            ctrl.get('linkedinHref'),
            `https://www.linkedin.com/shareArticle?url=${location}&mini=true&title=test+title&summary=test+description&source=OSF`
        );
    });
});

test('trunc() works properly: only unicode', function (assert) {
    //Each Chinese characters is 3 bytes long in Unicode.
    let unicodeString = '上下而求索';
    let expectedTruncatedString = '上下';
    assert.strictEqual(trunc(unicodeString, 6), expectedTruncatedString);
    assert.strictEqual(trunc(unicodeString, 7), expectedTruncatedString);
    assert.strictEqual(trunc(unicodeString, 8), expectedTruncatedString);
});

test('trunc() works properly: only ASCII', function (assert) {
    let asciiString = 'ascii string';
    assert.strictEqual(trunc(asciiString, 5), 'ascii');
    assert.strictEqual(trunc(asciiString, 6), 'ascii ');
    assert.strictEqual(trunc(asciiString, 7), 'ascii s');
});

test('trunc() works properly: ASCII and Unicode', function (assert) {
    let unicodeString = 'Open Science 开放科学';
    assert.strictEqual(trunc(unicodeString, 13), 'Open Science ');
    assert.strictEqual(trunc(unicodeString, 14), 'Open Science ');
    assert.strictEqual(trunc(unicodeString, 15), 'Open Science ');
    assert.strictEqual(trunc(unicodeString, 16), 'Open Science 开');
    assert.strictEqual(trunc(unicodeString, 17), 'Open Science 开');
    assert.strictEqual(trunc(unicodeString, 18), 'Open Science 开');
    assert.strictEqual(trunc(unicodeString, 19), 'Open Science 开放');
});

test('emailHref computed property', function (assert) {
    const ctrl = this.subject();

    Ember.run(() => {
        const location = encodeURIComponent(window.location.href);

        ctrl.set('hyperlink', window.location.href);
        ctrl.set('title', 'test title');

        assert.strictEqual(
            ctrl.get('emailHref'),
            `mailto:?subject=test+title&body=${location}`
        );
    });
});
