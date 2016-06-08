# Ember OSF

`master` Build Status: [![Build Status](https://travis-ci.org/CenterForOpenScience/ember-osf.svg?branch=master)](https://travis-ci.org/CenterForOpenScience/ember-osf)

`develop` Build Status: [![Build Status](https://travis-ci.org/CenterForOpenScience/ember-osf.svg?branch=develop)](https://travis-ci.org/CenterForOpenScience/ember-osf)

This repo contains code for interacting with the OSF APIv2 inside of an Ember app.

## Contributing?

Please read the [CONTRIBUTING.md](https://github.com/CenterForOpenScience/ember-osf/blob/develop/.github/CONTRIBUTING.md)

## Installation (for Development)

* `git clone` this repository
* `npm install`
* `bower install`

## Using this code in an Ember app

1. Clone the repository: `git clone https://github.com/CenterForOpenScience/ember-osf.git`
2. From the consuming Ember app:
  - install the addon and it's dependencies: `ember install ../ember-osf`
	- this generates a config/local.yml file (see 'Configuration' below)
  - link the app for local development: `npm link ../ember-osf`
  - Import code from ember-osf like:
  ```javascript
  import Ember from 'ember';
  import OsfLoginRouteMixin from 'ember-osf/mixins/osf-login-route';

  export default Ember.Route.extend(OsfLoginRouteMixin);
  ```

> **Note**: Running ember install will automatically install all bower and npm dependencies for ember-osf.

## Configuration

#### local.yml settings

This file is structured like:
```yaml
<backend>:
  CLIENT_ID: null
  PERSONAL_ACCESS_TOKEN: null
  OAUTH_SCOPES: osf.full_read osf.full_write
```

You will need to fill out options for each backend you want to use (see 'Running' below).
We recommend using the 'test' backend for development and testing as it is the most stable
of our environments.

Edit the new file (installed in the config directory) and set:
- `CLIENT_ID` to the client id of your developer application
- `PERSONAL_ACCESS_TOKEN` to the newly generated token (if applicable, optional for staging development)

#### Using the Test API

To do this, you will need to [create a developer application](https://test.osf.io/settings/applications/) on the relevant version of the OSF.

#### Running the OSF Locally (optional)

For local development, you will need to be running the [OSF APIv2](https://github.com/CenterForOpenScience/osf.io#running-the-api-server).
To connect to the APIv2 while using [fakecas](https://github.com/CenterForOpenScience/osf.io#running-the-osf), you will need to generate a
personal access token on your local OSF instance ([here](http://localhost:5000/settings/tokens/-- go ahead and grant access to all scopes)).

##### Cookie-based authentication with local OSF
Very few consumers of the `ember-osf` addon will interact with the OSF via cookies. However, if you are one of those users, 
you may encounter issues sending cookies between the ember app and the API server, in local development.
 
To create the most production-like experience possible, you will need to proxy both the ember app and the API server to a common domain name.
This may be done according to the following steps (written for Mac OS; some adaptation required for other platforms)

1. Install nginx: `brew install nginx`
  - Optionally tell nginx to start whenever your computer does: `brew services start nginx`
2. Add an entry for a fictitious domain to your `/etc/hosts` file, pointing at localhost, eg: `127.0.0.1       osf.embertest`
  - You will need a similar line for any subdomains, such as `api.osf.embertest`
  - This can be accessed in your browser as `http://osf.embertest`. You may need to include the protocol in Google Chrome to avoid being redirected to search.
3. Add the following section to your `nginx.conf` file, making adjustments as needed to match your local paths and ports:
```
server {
    listen       0.0.0.0:80;
    server_name  osf.embertest;

    location /static/ {
        alias /Users/andyboughton/code/cos/osf.io/website/static;
    }
    location / {
        keepalive_timeout 15;
        add_header Access-Control-Allow-Origin *;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://127.0.0.1:4200;
    }
},
server {
    listen       0.0.0.0:80;
    server_name  api.osf.embertest;

    location / {
        keepalive_timeout 15;
        add_header Access-Control-Allow-Origin *;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://127.0.0.1:8000;
    }
}
```


#### Create a local settings file

If for some reason you don't have a config/local.yml you can generate one. To do this:
```bash
ember generate ember-osf
```

## Usage

#### Ember Data: Using the OSF models

The models, serializers, adapters bundled in this addon with be available to you automatically.
For example, simply do:
```javascript
this.store.findAll('node')
```
to fetch all nodes.

## Running

We recommend developers target out test server:
- test (`test`): matches production features, very stable

Other options include:
- local (`local`): for developers running the OSF stack locally
- staging (`stage`): contains bleeding edge features, but less stable
- staging2 (`stage2`): another version of staging using running a specific feature branch

Then (using test as an example) run:
`BACKEND=test ember server`

and visit your app at http://localhost:4200.

**Note:** This runs the dummy app contained in /tests/dummy

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
