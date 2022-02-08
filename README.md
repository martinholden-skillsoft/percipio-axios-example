# percipio-axios-example

Demonstrates using the [Percipio Axios Client](https://github.com/martinholden-skillsoft/percipio-axios) to call a Percipio API method. The example code calls the [Common API getCollections method](https://api.percipio.com/common/api-docs/#/%2Fv1/getCollections).

As the [Percipio Axios Client](https://github.com/martinholden-skillsoft/percipio-axios) is not published to NPMJS, it is loaded from the GitHub repo.

It also illustrates concepts such as passing a custom Axios Instance during creation of the client, the example Axios instance is extended with interceptors to add timing data and a correlation id. It also shows how the replacement of placeholders in the resource path work.

To use this code you will need:

1. A Skillsoft [Percipio](https://www.skillsoft.com/platform-solution/percipio/) Site
1. A [Percipio Service Account](https://documentation.skillsoft.com/en_us/pes/Integration/int_api_rest_authentication.htm#Authorization)

# Configuration

## Environment Configuration

Set the following environment variables, or create a .env file by copying [.env.example](.env.example) to .env and populating the values.

| ENV      | Required | Description                                                                                                                                                        |
| -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| BASE_URL | Required | This is set to the base URL for the appropriate Percipio data center. For US hosted use: https://api.percipio.com For EU hosted use: https://dew1-api.percipio.com |
| ORG_ID   | Required | This is the Percipio Organiation UUID for your Percipio Site.                                                                                                      |
| BEARER   | Required | This is the Percipio Bearer token for the Service Account.                                                                                                         |

<br/>

# Running the application

After ensuring the configuration is complete, and **npm install** has been run you can simply run the app:

```bash
npm start
```

or

```bash
node ./index.js
```

# Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

# License

MIT © martinholden-skillsoft
