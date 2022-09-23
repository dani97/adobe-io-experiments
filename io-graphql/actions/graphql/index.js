/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { graphql, buildSchema } = require('graphql');
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils');

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    const requiredParams = ['query'];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders);
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    var schema = buildSchema(`
      type Query {
        bestTweets: [Tweets]
      }

      type Tweets {
        text: String
        handle: String
        sku: String
      }
    `);

    var resolver = {
      bestTweets: () => {
        return [{
          'text' : "Very good product",
          'handle': 'hi123',
          'sku' : 'WSH07'
        },
        {
          'text' : "Doesn't disappoint",
          'handle': 'play123',
          'sku' : '24-MB05'
        }
      ]
    }};

    var context = {};


    const variables = typeof (params.variables) === 'string' ? JSON.parse(params.variables) : params.variables;

    var response = await graphql({
      schema: schema,
      source: params.query,
      rootValue: resolver,
      contextValue: context,
      variableValues: variables,
      operationName: params.operationName
    });

    return {
      statusCode: 200,
      body: response
    };

    // check for missing request input parameters and headers
  } catch(e) {
    logger.error(e);
    return {
        statusCode: 200,
        body: {error: e.message}
    };
  }
}

exports.main = main;
