encodeBase64 = require('hono/utils/encode');
const { Core } = require('@adobe/aio-sdk');

const logger = Core.Logger('main', { level: 'info' });

function getQueryParams (params) {
    let queryParams = Object.assign({}, params);
    delete queryParams['__ow_path'];
    delete queryParams['__ow_body'];
    delete queryParams['__ow_headers'];
    delete queryParams['__ow_user'];
    delete queryParams['__ow_method'];
    delete queryParams['LOG_LEVEL'];
    delete queryParams['body'];
    return queryParams;
  }

function buildRequest(params) {
    logger.info(JSON.stringify(params));
    let options = {
        method: params['__ow_method'],
        headers: params['__ow_headers'],
    }
    if (params['body']) {
        options.body = JSON.stringify(params['body']);
    }
    logger.info('Request options: ' + JSON.stringify(options));

    const query = new URLSearchParams(getQueryParams(params))
    const url = "https://example.com" + params['__ow_path'] + '?' + query.toString();
    return new Request(url, options);
}

async function buildResponse(response) {
    const contentType = response.headers.get('content-type')
    let isBase64Encoded = contentType && isContentTypeBinary(contentType) ? true : false

    if (!isBase64Encoded) {
      const contentEncoding = response.headers.get('content-encoding')
      isBase64Encoded = isContentEncodingBinary(contentEncoding)
    }

    const body = isBase64Encoded ? encodeBase64(await response.arrayBuffer()) : await response.text()
    return {
        headers: response.headers,
        statusCode: response.status,
        body: body
    };
}

const isContentTypeBinary = (contentType) => {
    return !/^(text\/(plain|html|css|javascript|csv).*|application\/(.*json|.*xml).*|image\/svg\+xml.*)$/.test(
      contentType
    )
}

const isContentEncodingBinary = (contentEncoding) => {
    if (contentEncoding === null) {
      return false
    }
    return /^(gzip|deflate|compress|br)/.test(contentEncoding)
  }

const handle =  async (app, params) => {
  const req = buildRequest(params);
  const response = await app.fetch(req);
  return buildResponse(response);
}

module.exports = {handle};