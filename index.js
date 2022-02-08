const { PercipioAxiosClient } = require('percipio-axios');
const { Agent: HttpAgent } = require('http');
const { Agent: HttpsAgent } = require('https');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const asciitable = require('asciitable');
const consola = require('consola');

require('dotenv').config();

// Check the environment variables are configured in the .env file
if (!process.env.ORG_ID || !process.env.BEARER_TOKEN || !process.env.BASE_URL) {
  consola.error(
    'Missing critical env vars. Make sure all variables are defined in .env file. Aborting. '
  );
  process.exit(1);
}

/**
 * Create a new Axios client with interceptors to add timing data
 * and a correlation id.
 *
 * @return {Axios} The Axios Instance
 */
const getAxiosInstance = () => {
  const httpAgent = new HttpAgent({ keepAlive: true });
  const httpsAgent = new HttpsAgent({ keepAlive: true });

  const axiosInstance = axios.create({ httpAgent, httpsAgent });

  // Add a request interceptor to add timings
  // and a correlation id to the config object.
  axiosInstance.interceptors.request.use((config) => {
    const updatedConfig = config;
    // Add timing key to the config
    if ('timings' in updatedConfig) {
      throw Error('timings already exist in the config object');
    }

    updatedConfig.timings = {
      sent: null,
      received: null,
      durationms: null,
    };

    if (!('requestCorrelationId' in updatedConfig)) {
      updatedConfig.requestCorrelationId = uuidv4();
    }
    updatedConfig.timings.sent = new Date();
    return updatedConfig;
  });

  // Add a response interceptor to add timings to the response
  // and a correlation id.
  axiosInstance.interceptors.response.use(
    (response) => {
      // Add timing key to the config
      if ('timings' in response.config) {
        response.config.timings.received = new Date();
        response.config.timings.durationms =
          response.config.timings.received - response.config.timings.sent;
        response.timings = response.config.timings;
      }
      if ('requestCorrelationId' in response.config) {
        response.requestCorrelationId = response.config.requestCorrelationId;
      }

      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response;
    },
    (error) => {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

/**
 * Create a new PercipioAxiosClient
 *
 * @param {Object} config
 * @return {PercipioAxiosClient} The PercipioAxiosClient Instance
 */
const getPercipioClient = (config) => {
  return new Promise((resolve, reject) => {
    try {
      const client = new PercipioAxiosClient(config);
      resolve(client);
    } catch (error) {
      reject(error);
    }
  });
};

// ------------------------------------------------------------------------------------

// Create a new Percipio Axios Client demonstrates
// Passing custom resourcePlaceholders used in the resource URL
// Passing a custom axios instance return by getrAxiosInstance()
getPercipioClient({
  baseURL: process.env.BASE_URL,
  orgId: process.env.ORG_ID,
  bearer: process.env.BEARER_TOKEN,
  resourcePlaceholders: { version: 'v1' },
  instance: getAxiosInstance(),
})
  .then((client) => {
    // This uses the Percipio Common API getCollections method.
    //
    // The resource to be used in the request, with placeHolders:
    //
    // {orgId} will be replaced by the orgId passed to the PercipioAxiosClient
    //
    // {version} will be replaced by the version passed to the PercipioAxiosClient in
    //
    // the resourcePlaceholders configuration option.
    const resource = '/common/{version}/organizations/{orgId}/collections';

    // Issue a GET request to the resource, passing in Axios resource configuration options
    client
      .get({
        resource,
        params: {},
        data: {},
        headers: { 'User-Agent': 'Percipio-Node-SDK' }, // This is an additional custom header
        timeout: 2000, // This is a standard Axios Request Config value
      })
      .then((response) => {
        consola.log('******** Timing Data ********\n');
        consola.log(asciitable([response.timings]));
        consola.log('********** Results **********\n');
        consola.log(asciitable(response.data));
      })
      .catch((err) => {
        consola.error(err);
      });
  })
  .catch((err) => {
    consola.error(err);
  });
