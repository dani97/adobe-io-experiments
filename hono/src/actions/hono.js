const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils');
const { Hono } = require('hono');

async function main (params) {
  const app = new Hono();

  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  
  app.get('/hello', (c) => {
    return {message: "hello app builder"}
  })

  app.all('/test', (_) => {
    return { test: "this is a different route"}
  })

  const response = await app.request(params['__ow_path']);
  return {
    statusCode: 200,
    body: response
  } 
}

exports.main = main;