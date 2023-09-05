# Ember OSF

`master` Build Status: ![Master Build Status](https://github.com/CenterForOpenScience/ember-osf/workflows/CI/badge.svg?branch=master)
[![npm Version](https://img.shields.io/npm/v/@centerforopenscience/ember-osf.svg)](https://www.npmjs.com/package/@centerforopenscience/ember-osf)

`develop` Build Status: ![Develop Build Status](https://github.com/CenterForOpenScience/ember-osf/workflows/CI/badge.svg?branch=develop)
[![Coverage Status](https://coveralls.io/repos/github/CenterForOpenScience/ember-osf/badge.svg?branch=develop)](https://coveralls.io/github/CenterForOpenScience/ember-osf?branch=develop)

This repo contains code for interacting with the [OSF APIv2](https://api.osf.io/v2/) inside of an Ember app. See
[addon API Docs](http://centerforopenscience.github.io/ember-osf/) for a list of what this addon provides.

## Contributing

Please read the [CONTRIBUTING.md](https://github.com/CenterForOpenScience/ember-osf/blob/develop/.github/CONTRIBUTING.md)

## Installing tools to develop and modify this addon

See the [yarn docs](https://yarnpkg.com/) for installing and using yarn. These instructions will prepare your
environment if you plan to modify and test this addon in isolation.

-   `git clone` this repository
-   `yarn install --frozen-lockfile`
-   `bower install`

## Using this addon in another Ember app

### For production use

Other applications that wish to consume this addon should add the following line manually to the consuming Ember app's
`package.json` file, then run `yarn install` and `bower install` inside that app.

`"ember-osf": "git+https://github.com/CenterForOpenScience/ember-osf.git#NewestCommitHashGoesHere",`

In the future, we will provide an installable `npm` package to simplify this process.

### For local development

1. Clone the repository: `git clone https://github.com/CenterForOpenScience/ember-osf.git`
2. From the consuming Ember app:

-   install the addon and it's dependencies: `ember install ../ember-osf`
    -   this generates a config/local.yml file (see 'Configuration' below)
-   link the app for local development: `npm link ../ember-osf`
-   Import code from ember-osf like:

```javascript
import Ember from "ember";
import OsfTokenLoginRouteMixin from "ember-osf/mixins/osf-token-login-route";

export default Ember.Route.extend(OsfLoginRouteMixin);
```

> **Note**: Running ember install will automatically install many bower and npm dependencies for ember-osf.

## Configuration

### Specifying configuration information

#### local.yml settings

If for some reason you don't have a config/local.yml you can generate one. To do this:

```bash
ember generate ember-osf
```

Ember-osf needs certain configuration variables to run. This is usually done via a config file structured as follows:

```yaml
OAUTH_SCOPES: osf.full_write
REDIRECT_URI: http://localhost:4200/login

CLIENT_ID: null
PERSONAL_ACCESS_TOKEN: null
```

You will need to fill out options for each backend you want to use (see 'Running' below).
We recommend using the 'test' backend for development and testing as it is the most stable
of our environments. When configuring your application, make sure that your login redirect
uri is correct. If it needs a trailing slash, be sure to include a trailing slash!

Edit the new file (installed in the config directory) and set:

-   `CLIENT_ID` to the client id of your developer application
-   `PERSONAL_ACCESS_TOKEN` to the newly generated token (Only required or recognized for the LOCAL backend; do not set
    this value for staging, production, or test backends)
-   `REDIRECT_URI`: Must exactly match the redirect URI used to register the OAuth developer application.
    Default value is appropriate for local development using `ember server`, with a login page at `/login`

Because of the potential for this file to include sensitive information, **we strongly recommend adding this file to
`.gitignore`** for your project.

#### Alternate option: Environment variables

If you do not wish to use file-based configuration, any of the settings above can be overridden individually as
environment variables with the same name as appears in the config file. Eg

`BACKEND=test CLIENT_ID=gibberish ember server`

If you provide a setting in both the config file and an environment variable, the environment variables take precedence.

You can always override auth-related settings, but attempts to override server URLs will be ignored unless you
explicitly specify `BACKEND=env` (see "Running" for example).

### Using the API

Most apps that use this addon will authorize requests via OAuth2. As may be apparent from the `CLIENT_ID` and
`REDIRECT_URI` settings above, you will need to [create a developer application](https://test.osf.io/settings/applications/)
on the relevant version of the OSF, and provide the appropriate settings for your app.

### Advanced usage: Selecting an authorization type

We expect that most projects based on `ember-osf` will authenticate via OAuth 2.0 ("Token Login"); the addon is
configured to use this out of the box, so long as you provide your own login page based on the appropriate mixins.
This is the most effective way for third-party applications to work with our services.

If you are developing an application that will be hosted under the `osf.io` domain, you may wish to use cookie-based
authentication instead. In that rare case, add the following lines to your `config/environment.js` file:

```javascript
var authorizationType = "cookie";
ENV.authorizationType = authorizationType;

ENV["ember-simple-auth"] = {
    authorizer: `authorizer:osf-${authorizationType}`,
    authenticator: `authenticator:osf-${authorizationType}`,
};
```

### Running the OSF Locally (optional)

For local development, you will need to be running the [OSF APIv2](https://github.com/CenterForOpenScience/osf.io#running-the-api-server).
To connect to the APIv2 while using [fakecas](https://github.com/CenterForOpenScience/osf.io#running-the-osf), you
will need to generate a personal access token on your local OSF instance [here](http://localhost:5000/settings/tokens/)-
go ahead and grant full privilege access to all scopes (the `osf.full_write` option).

## Using this addon

### Ember Data: Using the OSF models

The models, serializers, adapters bundled in this addon with be available to you automatically.
For example, simply do:

```javascript
this.store.findAll("node");
```

to fetch all nodes (or at least the first page of results). If you need to fetch many results, see the API docs for
information about how to handle pagination. Ember-osf also provides support for
[paginated relationship requests](https://github.com/mdehoog/ember-data-has-many-query) via a third-party addon.

### MathJax

We use [MathJax](https://www.mathjax.org/) to make math look pretty in all browsers. If you want this in your application, copy this section into the `<head>` element of your `index.html` file:

```
<script type="text/javascript"
    src="//cdnjs.cloudflare.com/ajax/libs/mathjax/2.6.1/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
</script>
<script type="text/x-mathjax-config">
    MathJax.Hub.Config({
        tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']], processEscapes: true},
        skipStartupTypeset: true
    });
</script>
```

### Advanced: using components and styles

Some of the ember-osf components require additional configuration to take advantage of premade widgets or styles.

Some of these settings, as well as recommended best practices, are gathered together in a
[demonstration app](https://github.com/abought/demo-ember-osf/) that consumes this addon.

## Running

### Using the addon with a specific server

We recommend developers target our test server:

-   test (`test`): matches production features, very stable

Ember-osf also ships with builtin support for several other servers:

-   local (`local`): for developers running the OSF stack locally
-   staging (`stage`): contains bleeding edge features, but less stable
-   staging2 (`stage2`) or `staging3` (`stage3`): Staging servers that run specific feature branches, usually for
    functionality that is being tested for longer or not targeted for immediate release
-   production (`prod`): The main osf.io site. This is a good choice for apps you deploy, but please be a good citizen
    and avoid using the production server for your test data.

Then (using test as an example) run:
`BACKEND=test ember server`

and visit your app at http://localhost:4200.

**Note:** When run from within the `ember-osf` repository, this command runs the dummy app contained in /tests/dummy

### Using a custom OSF backend

In certain circumstances, you may wish to use a custom set of servers not known to the `ember-osf` addon.
You can elect to specify your server URLs individually, by specifying `BACKEND=env` and passing additional environment
variables/config file entries. For example:

`BACKEND=env OSF_URL=https://e.io/ OSF_API_URL=https://api.e.io OSF_RENDER_URL=https://mfr.e.io/render OSF_FILE_URL=https://files.e.io OSF_HELP_URL=https://help.e.io OSF_COOKIE_LOGIN_URL=https://accounts.e.io/login OSF_OAUTH_URL=https://accounts.e.io/oauth2/authorize ember server`

## Running Tests

-   `yarn test` will run all tests used by Github Actions
-   `ember test --server` will run just ember tests, and reload any time that code is changed

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).

## Distribution / releases

The information below applies only to package maintainers, and most users will not need this.

The following commands can be used to publish a new release of `ember-osf`:

-   `yarn run bump-version [<newversion> | major | minor | patch]`: Verify that the code is in a releasable state,
    increment the version number without generating a new git commit, and update documentation.
    See [docs](https://docs.npmjs.com/cli/version) for recognized options.
-   `yarn run make-release`: Uses [git flow](https://github.com/nvie/gitflow) to prepare a new release.
    You must be on the develop branch, commit all changes, and have run `git init` in this folder at least one time (ever).
-   `yarn publish`: [Publish](https://docs.npmjs.com/getting-started/publishing-npm-packages) a new version of the
    package to the NPM registry. It is highly recommended that you do this from a fresh checkout of the repo, and
    [validate](https://docs.npmjs.com/misc/developers#before-publishing-make-sure-your-package-installs-and-works)
    the package contents before uploading. You must be a recognized NPM collaborator or this command will fail.
