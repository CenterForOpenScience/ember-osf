import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('index', {
        path: '/'
    });
    this.route('nodes', function() {
        this.route('detail', {
            path: '/:node_id'
        }, function() {
            this.route('children');
            this.route('files', function() {
                this.route('provider', {
                    path: '/:provider'
                }, function() {
                    this.route('file', {
                        path: '/:file_id'
                    });
                });
            });
        });
    });
    this.route('login');
    this.route('signup');
    this.route('institutions', function() {
        this.route('detail', {
            path: '/:institution_id'
        });
    });
    this.route('registrations', function() {
        this.route('detail', {
            path: '/:registration_id'
        });
    });
    this.route('users', function() {
        this.route('list', {
            path: '/'
        });
        this.route('detail', {
            path: '/:user_id'
        });
    });
    this.route('profile');
    this.route('collections', function() {
        this.route('detail', {
            path: '/:collection_id'
        });
    });
    this.route('prereg');
    this.route('allnodes');
    this.route('usernodes');
});

export default Router;
