import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(/*data, block*/) {
        // xhr object should be accessible from outer closure
        xhr.withCredentials = true;
    }
});
