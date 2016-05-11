import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('index', {path: '/'});
    this.route('nodes', function() {
        this.route('detail', {path: '/:node_id'});
    });
    this.route('login');
    this.route('users', function() {
        this.route('detail', {path: '/:user_id'});
    });
});

export default Router;
