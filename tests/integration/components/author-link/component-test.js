import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

moduleForComponent('author-link', 'Integration | Component | author link', {
  integration: true
});

test('contributor with identifier creates link to author', function(assert) {
    const contributor = Ember.Object.create({
        users: {
            identifiers: ['https://www.osf.io/twain'],
            name: 'Mark Twain'
        }
    });
    this.set('contributor', contributor);
    this.render(hbs`{{author-link
        contributor=contributor
    }}`);

    assert.equal(this.$().text().trim(), 'Mark Twain');
    assert.equal(this.$('a').length, 1);
    assert.equal(this.$('a')[0].href, "https://www.osf.io/twain");
});

test('contributor without identifier does not have author link', function(assert) {
    const contributor = Ember.Object.create({
        users: {
            identifiers: [],
            name: 'Mark Twain'
        }
    });
    this.set('contributor', contributor);
    this.render(hbs`{{author-link
        contributor=contributor
    }}`);

    assert.equal(this.$().text().trim(), 'Mark Twain');
    assert.equal(this.$('a').length, 0);
});
