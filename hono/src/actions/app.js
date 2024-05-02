const { Hono } = require('hono');

const app = new Hono();

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
  return c.text('Server Error', 500)
});

module.exports = { app };