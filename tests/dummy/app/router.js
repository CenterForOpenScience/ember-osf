import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
    location: config.locationType
});

Router.map(function() {
    this.route('index', {path: '/'});
    this.route('nodes', function() {
	this.route('detail', {path: '/:node_id'}, function() {
            this.route('files', function() {
                this.route('detail', {path: '/:file_id'});
            });
        });
    });
    this.route('login');
});

export default Router;
