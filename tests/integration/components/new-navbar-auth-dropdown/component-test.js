import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


// Session Stub No Auth
const sessionStubUnauthenticated = Ember.Service.extend({
  isAuthenticated: false
});

// Session Stub Auth
const sessionStubAuthenticated = Ember.Service.extend({
  isAuthenticated: true
});

moduleForComponent('new-navbar-auth-dropdown', 'Integration | Component | new navbar auth dropdown', {
  integration: true,
});

test('it renders when session is authenticated', function (assert) {
  this.register('service:session', sessionStubAuthenticated);
  this.set('loginAction', ()=>{});
  this.render(hbs`{{new-navbar-auth-dropdown loginAction=loginAction}}`);

  assert.ok(this.$('.osf-profile-image').length, 'has gravatar for authenticated session');
  assert.notEqual(this.$().text().trim(), '');
});

test('it renders when session is not authenticated', function (assert) {
  this.register('service:session', sessionStubUnauthenticated);
  this.set('loginAction', ()=>{});
  this.render(hbs`{{new-navbar-auth-dropdown loginAction=loginAction}}`);

  assert.notOk(this.$('.osf-profile-image').length, 'no gravatar for unauthenticated session');
  assert.notEqual(this.$().text().trim(), '');
});
