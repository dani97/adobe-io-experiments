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
      productReviews(sku: String!): [Reviews]
      productsReviews(sku: [String!]!): [productReviewslist]
    }
    
    type Reviews {
      text: String
      handle: String
      sku: String
    }
    
    type Review {
      text: String
      handle: String
    }
    
    type productReviewslist {
      sku : String
      reviews: [Review]
    }
    
      
    `);
    const reviews = [
      {
        'text' : "Very good product",
        'handle': 'ajaz',
        'sku' : 'VT12'
      },
      {
        'text' : "Doesn't disappoint",
        'handle': 'simran',
        'sku' : 'VD03'
      },
      {
        'text' : "worst product ever",
        'handle': 'chris',
        'sku' : 'VD03'
      }
    ]
    

    var resolver = {
          productReviews : ( {sku}  ) => {
            const filteredReviews =   reviews.filter((review) => review.sku === sku);
            console.log(filteredReviews);
            const productReviews = filteredReviews.map((review) => ({
            text: review.text,
            handle: review.handle,
            sku: review.sku,
      }));
      return productReviews;
      }
      ,
        productsReviews :( {sku}  ) => {
        const result = [];
        reviews.forEach((review) => {
          if (sku.includes(review.sku)) {
            let productReviews = result.find(
              (item) => item.sku === review.sku
            );
            if (!productReviews) {
              productReviews = { sku: review.sku, reviews: [] };
              result.push(productReviews);
            }
            productReviews.reviews.push({
              text: review.text,
              handle: review.handle,
            });
          }
  });
  return result;
  
      },
    };
    
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