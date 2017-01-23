# Ember OSF

`master` Build Status: [![Build Status](https://travis-ci.org/CenterForOpenScience/ember-osf.svg?branch=master)](https://travis-ci.org/CenterForOpenScience/ember-osf)

`develop` Build Status: [![Build Status](https://travis-ci.org/CenterForOpenScience/ember-osf.svg?branch=develop)](https://travis-ci.org/CenterForOpenScience/ember-osf)

This repo contains code for interacting with the OSF APIv2 inside of an Ember app.

## Contributing?

Please read the [CONTRIBUTING.md](https://github.com/CenterForOpenScience/ember-osf/blob/develop/.github/CONTRIBUTING.md)

## Installation (for Development)
See the [yarn docs](https://yarnpkg.com/) for installing and using yarn.

* `git clone` this repository
* `yarn install --pure-lockfile`
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
  import OsfTokenLoginRouteMixin from 'ember-osf/mixins/osf-token-login-route';

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
  REDIRECT_URI: http://localhost:4200/login
```

You will need to fill out options for each backend you want to use (see 'Running' below).
We recommend using the 'test' backend for development and testing as it is the most stable
of our environments.  When configuring your application, make sure that your login redirect
uri is correct.  If it needs a trailing slash, be sure to include a trailing slash!

Edit the new file (installed in the config directory) and set:
- `CLIENT_ID` to the client id of your developer application
- `PERSONAL_ACCESS_TOKEN` to the newly generated token (Only required or recognized for the LOCAL backend; do not set this value for staging, production, or test backends)
- REDIRECT_URI: Must exactly match the redirect URI used to register the OAuth developer application. 
Default value is appropriate for local development using `ember server`, with a login page at `/login` 

Because of the potential for this file to include sensitive information, we strongly recommend adding this file to 
`.gitignore` for your project.

#### Using the Test API

To do this, you will need to [create a developer application](https://test.osf.io/settings/applications/) on the relevant version of the OSF.

#### Running the OSF Locally (optional)

For local development, you will need to be running the [OSF APIv2](https://github.com/CenterForOpenScience/osf.io#running-the-api-server).
To connect to the APIv2 while using [fakecas](https://github.com/CenterForOpenScience/osf.io#running-the-osf), you will need to generate a
personal access token on your local OSF instance [here](http://localhost:5000/settings/tokens/)--go ahead and grant access to all scopes.

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

* `yarn test`
* `ember test --server`

## Building

* `yarn run build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
