import Base from 'ember-simple-auth/authorizers/base';

export default Base.extend({
    authorize(/*data, block*/) {
        // Cookies will be sent automatically with requests; no specific actions needed
    }
});
