const { Core } = require('@adobe/aio-sdk')
const { getQueryParams } = require('../utils');
const { Hono } = require('hono');

async function main (params) {
  const app = new Hono();

  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })
  
  // routes declaration
  app.get('/hello', (c) => {
    return c.json({message: "hello app builder"})
  })

  app.get('/test', (c) => {
    return c.json({ test: "this is a different route", query: c.req.query()})
  })

  // default route
  app.all('/', (c) => {
    return c.json({ message: "Welcome to homepage"});
  })

  // error handler
  app.onError((err, c) => {
    console.error(`${err}`)
    return c.text('Server Error', 500)
  })

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