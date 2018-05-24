/* eslint-disable no-unused-vars */

import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('scheduled-banner', 'Integration | Component | scheduled banner', {
    integration: true
});

test('scheduled banner renders', function(assert) {
    const banner = Ember.Object.create({
        color: '#f21616',
        defaultAltText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus quis mattis odio. Fusce dignissim velit turpis, non placerat quam venenatis sit amet.',
        mobileAltText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        defaultPhoto: 'assets/img/bg-donate-1.jpg',
        mobilePhoto: 'assets/img/bg-donate-2.jpg',
        startDate: '2018-03-14T00:00:00',
    });

    this.setProperties({banner});
    this.render(hbs`{{scheduled-banner}}`);

    assert.ok(this.$('.banner').length);
});
