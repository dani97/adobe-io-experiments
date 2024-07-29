const { Hono } = require('hono');
const { cors } = require('hono/cors');
const { Core } = require('@adobe/aio-sdk');

const app = new Hono();

// routes declaration
app.get('/hello', (c) => {
  return c.json({message: "hello app builder"})
})

app.get('/test', (c) => {
  return c.json({ test: "this is a different route", query: c.req.query()})
})

app.notFound((c) => {
  return c.text('Route not found 404 Message', 404)
})

// default route
app.all('/', (c) => {
  return c.json({ message: "Welcome to homepage"});
})

app.post('/users', async (c) => {
  logger = Core.Logger('main', { level: 'info' });
  logger.info('Creating user');
  const body = await c.req.json();
  logger.info(body);
  return c.json({message: "User created"})
});

app.use(cors());

// error handler
app.onError((err, c) => {
  const logger =  Core.Logger('main', { level: 'info' })
  logger.error(err);
  return c.text('Server Error', 500)
});

module.exports = {
  app
}