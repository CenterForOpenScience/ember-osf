import Ember from 'ember';

export default Ember.Controller.extend({
    actions: {
        loginHandler: function () {
            console.log('Called submit', ...arguments);
            return true;
        }
    }
});
