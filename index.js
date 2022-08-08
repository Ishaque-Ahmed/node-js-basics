const fs = require('fs');
const http = require('http');
const url = require('url');

const slugify = require('slugify');

const replaceTemplate = require('./middlewares/replaceTemlates');

const tempOver = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

const slugs = dataObject.map((product) =>
  slugify(product.productName, { lower: true })
);
// console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // console.log(req.url);
  // console.log(url.parse(req.url, true));

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-type': 'text/html',
    });

    const cardsHtml = dataObject
      .map((curObj) => replaceTemplate(tempCard, curObj))
      .join('');
    const output = tempOver.replace('{%PRODUCT_CARDS%}', cardsHtml);
    // console.log(output);
    res.end(output);
  } else if (pathname === '/product') {
    // console.log(query);
    res.writeHead(200, {
      'Content-type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
    });
    res.end('<h1>Page Not Found!</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to request on port 8000');
});
