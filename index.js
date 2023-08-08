const http = require('http');
const fs = require('fs');
const url = require('url');
const replace_template = require('./modules/replace.js');

// Templates
const overview_page = fs.readFileSync('./templates/overview.html', 'utf-8');
const product_cards = fs.readFileSync('./templates/template-card.html', 'utf-8');
const product_page = fs.readFileSync('./templates/product.html', 'utf-8');

const products = fs.readFileSync('./data/data.json', 'utf-8');
const products_json = JSON.parse(products);

const server = http.createServer((req, res) => {
    const params = url.parse(req.url, true)
    const path_name = params.pathname;

    if (path_name == '/' || path_name == '/overview') {
        res.writeHead(200, {
            'content-type': 'text/html'
        });

        const cards = products_json.map(product => {
            return replace_template(product_cards, product);
        });

        const overview_page_with_cards = overview_page.replace('{{PRODUCT_CARDS}}', cards)
        res.end(overview_page_with_cards);
    }
    else if (path_name == '/product') {
        const id = params.query.id;
        
        let filtered_product = null
        if(id != null && id != undefined) {
            filtered_product = products_json.find(item => {
                return item.id == id;
            });
        }

        let page = null
        if(filtered_product) {
            page = replace_template(product_page, filtered_product);
        }

        if(page != null) {
            res.writeHead(200, {
                'content-type': 'text/html'
            });
            res.end(page);
        } else {
            res.end('Page not Found')
        }
    }
    else if(path_name == '/api') {
        res.writeHead(200, {
            'content-type': 'application/json'
        })
        res.end(products);
    }
    else {
        res.writeHead(404,{
            'content-type': 'text/html',
        });
        res.end('<strong>Page not found</strong>');
    }
});

server.listen(8000, '127.0.0.1', function() {
    console.log('Listening on port 8000');
});