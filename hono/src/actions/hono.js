const {app} = require('./app');
const  {handle} = require('./handle');

async function main (params) {
  return handle(app, params);
}

exports.main = main;