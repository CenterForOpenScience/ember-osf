# Ember OSF

This repo contains code for interacting with the OSF APIv2 inside of an Ember app.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Configuration

For local development, you will need to be running the [OSF APIv2](https://github.com/CenterForOpenScience/osf.io#running-the-api-server).
To connect to the APIv2 while using [fakecas](https://github.com/CenterForOpenScience/osf.io#running-the-osf), you will need to generate a
personal access token on your local OSF instance ([here](http://localhost:5000/settings/tokens/-- go ahead and grant access to all scopes). Next:

```bash
cp .env-dist .env
```
and edit the new .env file to replace `<your_personal_access_token>` with the newly generated token.

## Running

* `ember server`
* Visit your app at http://localhost:4200.

**Note:** This runs the dummy app contained in /tests/dummy

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
