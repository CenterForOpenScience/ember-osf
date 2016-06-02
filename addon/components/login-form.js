import Ember from 'ember';
import layout from '../templates/components/login-form';

// TODO: Future reading- add responsiveness on delays http://blog.trackets.com/2013/05/23/how-to-write-a-login-form.html
export default Ember.Component.extend({
    layout,

    identification: undefined,
    password: undefined,

    actions: {
        loginSubmit() {
            this.sendAction('loginSubmit', ...arguments);
        }
    }
});
