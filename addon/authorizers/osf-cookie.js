import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(/*data, block*/) {
        // xhr object should be accessible from outer closure
        // https://github.com/simplabs/ember-simple-auth/blob/bed56395e8ce0e376e28b6ea9a62a4e26585d875/addon/mixins/data-adapter-mixin.js
        console.log('confirm that xhr is available through closure', xhr); // jshint ignore:line
        xhr.withCredentials = true; // jshint ignore:line
    }
});
