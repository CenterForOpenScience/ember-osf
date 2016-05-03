# Ember OSF

This repo contains code for interacting with the OSF APIv2 inside of an Ember app.

## Installation

*   `git clone` this repository
*   `npm install`
*   `bower install`

## Configuration

### Using the Staging or Production API (preferred)

To do this, you will need to [create a developer application](https://staging.osf.io/settings/applications/) on the
relevant version of the OSF.

### Running the OSF Locally (optional)

For local development, you will need to be running the [OSF
APIv2](https://github.com/CenterForOpenScience/osf.io#running-the-api-server). To connect to the APIv2 while using
[fakecas](https://github.com/CenterForOpenScience/osf.io#running-the-osf), you will need to generate a personal
access token on your local OSF instance ([here](http://localhost:5000/settings/tokens/-- go ahead and grant access
    to all scopes)).

### Create a .env

To connect to the APIv2 while using [fakecas](https://github.com/CenterForOpenScience/osf.io#running-the-osf), you will
need to generate a personal access token on your local OSF instance ([here](http://localhost:5000/settings/tokens/-- go
ahead and grant access to all scopes)).

Next, depending on the environment you want to target, you will need to create the .env file. For:

*   local: .env-local
*   staging: .env-stage
*   staging2: .env-stage2
*   production: .env-prod

To do this:

```bash
cp .env-dist .env-<env>

```

and edit the new .env file to replace `<your_personal_access_token>` with the newly generated token.

Edit the new .env and replace:

*   `<your_client_id>` with the client id of your developer application
*   `<your_personal_access_token>` with the newly generated token (if applicable)

**Note**: For development, we reccomend point your local app to our staging servers: `ember s --environment staging`

## Running

*   `ember server`
*   Visit your app at [http://localhost:4200](http://localhost:4200).

**Note:** This runs the dummy app contained in /tests/dummy

## Running Tests

*   `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
*   `ember test`
*   `ember test --server`

## Building

*   `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
