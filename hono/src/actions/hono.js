const { Core } = require('@adobe/aio-sdk')
const { getQueryParams } = require('../utils');
const { app } = require('./app');

async function main (params) {
  // create headers for request
  const options = {
    headers: params['__ow_headers'],
    method: params['__ow_method'],
  }
  
  // create body for request
  if (params['__ow_body']) {
    options.body = params['__ow_body']
  }

  // capture URL search params
  const query = new URLSearchParams(getQueryParams(params));

  // call hono server and return response
  const response = await app.request(params['__ow_path'] +'?' + query.toString(), options);

  return {
    statusCode: response.status,
    body: await response.json(),
    headers: response.headers
  } 
}

exports.main = main;