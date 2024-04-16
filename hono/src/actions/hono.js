const { Core } = require('@adobe/aio-sdk')
const { getQueryParams } = require('../utils');
const { Hono } = require('hono');

async function main (params) {
  const app = new Hono();

  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  
  app.get('/hello', (c) => {
    return c.json({message: "hello app builder"})
  })

  app.all('/test', (c) => {
    return c.json({ test: "this is a different route", query: c.req.query()})
  })

  const options = {
    headers: params['__ow_headers'],
    method: params['__ow_method'],
  }
  if (params['__ow_body']) {
    options.body = params['__ow_body']
  }

  const query = new URLSearchParams(getQueryParams(params));

  const response = await app.request(params['__ow_path'] +'?' + query.toString(), options);
  return {
    statusCode: 200,
    body: await response.json()
  } 
}

exports.main = main;