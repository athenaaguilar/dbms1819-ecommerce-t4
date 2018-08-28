const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { Client } = require('pg');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const Handlebars = require("handlebars");
const MomentHandler = require("handlebars.moment");
MomentHandler.registerHelpers(Handlebars);
const client = new Client({
  database: 'd2t940tht305hl',
  user: 'ghopovwglmxpmf',
  password: '0ae10684d3e31fd8d14fcd0fa8c4f87ebeb3f79368a0a2cd2f0e4a155ef6d35a',
  host: 'ec2-50-17-189-165.compute-1.amazonaws.com',
  port: 5432,
  ssl: true
});
client.connect();

const app = express();
// tell express which folder is a static/public folder
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('port', (process.env.PORT || 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
const Product = require('./models/product');
const Brand = require('./models/brand');
const Order = require('./models/order');
const Category = require('./models/category');

app.get('/', function (req, res) {
  res.render('home', { });
});

app.get('/products/:id', function (req, res) {
  client.query('SELECT products.id AS productsid,products.img AS productsimg,products.name AS productsname, products.descriptions AS productsdesc,products.tagline AS productstag,products.price AS productsprice,products.warranty AS productswarranty,products_brand.name AS productsbrand,products_brand.description AS branddesc,products_category.name AS categoryname FROM products INNER JOIN products_brand ON products.brand_id=products_brand.id INNER JOIN products_category ON products.category_id=products_category.id WHERE products.id = ' + req.params.id + '; ')
    .then((results) => {
      console.log('results?', results);
      res.render('product', {
        product: results.rows,
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/store', (req, res) => {
  Product.list(client,{},function(product){
    res.render('store',{
      product: product
    });
  });
});
app.get('/productlist', (req, res) => {
  Product.list(client,{},function(product){
    res.render('product_list',{
      product: product
    });
  });
});
app.get('/brand/create', function (req, res) {
  res.render('create_brand', {
  });
});

app.get('/admin', function (req, res) {
  res.render('admin', {
  });
});

app.get('/category/create', function (req, res) {
  res.render('create_category', {
  });
});

app.get('/product/create', function (req, res) {
  var brand;
  var category;
  Brand.list(client,{},function(brands){
     brand = brands;
  });
 Category.list(client,{},function(category){
      res.render('create_product',{
        category: category,
        brand1: brand
      });
    }); 
     
  });

app.get('/brands', function (req, res) {
  Brand.list(client,{},function(brands){
    res.render('brand_list',{
      brands: brands
    });
  });
});

app.get('/categories', function (req, res) {
  Category.list(client,{},function(category){
    res.render('category_list',{
      category: category
    });
  });
});

app.get('/product/update/:id', function (req, res) {
  var category = [];
  var brand = [];
  var both = [];
  client.query('SELECT * FROM products_brand;')
    .then((result) => {
      brand = result.rows;
      console.log('brand:', brand);
      both.push(brand);
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
  client.query('SELECT * FROM products_category;')
    .then((result) => {
      category = result.rows;

      both.push(category);
      console.log('both', both);
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
  client.query('SELECT products.id AS productsid,products.img AS productsimg,products.name AS productsname, products.descriptions AS productsdesc,products.tagline AS productstag,products.price AS productsprice,products.warranty AS productswarranty,products_brand.name AS productsbrand,products_brand.description AS branddesc,products_category.name AS categoryname FROM products INNER JOIN products_brand ON products.brand_id=products_brand.id INNER JOIN products_category ON products.category_id=products_category.id WHERE products.id = ' + req.params.id + ';')
    .then((result) => {
      res.render('update_product', {
        rows: result.rows[0],
        brand: both
      });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/customers', function (req, res) {
  client.query('SELECT * FROM customer ORDER BY id DESC')
    .then((result) => {
      console.log('results?', result);
      res.render('customer_list', result);
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});
app.get('/customers/:id', function (req, res) {
  client.query("SELECT customer.first_name AS fname,customer.last_name AS lname,customer.email AS email,customer.street AS street,customer.municipality AS mun,customer.province AS province,customer.zipcode AS zip,products.name AS product,orders.quantity AS qty,orders.order_date AS orderdate FROM orders INNER JOIN customer ON customer.id=orders.customer_id INNER JOIN products ON products.id=orders.product_id WHERE customer.id = '" + req.params.id + "'ORDER BY orderdate DESC ")
    .then((result) => {
      console.log('results?', result);
      res.render('customer_details', result);
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.get('/orders', function (req, res) {
  Order.list(client,{},function(orders){
    res.render('order_list',{
      orders: orders
    });
  });
});

app.post('/send-email', function (req, res) {
  var maillist = ['teamfourdbms@gmail.com', req.body.email];
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'teamfourdbms@gmail.com',
      pass: 'aguilarliberato04'
    }
  });
  const mailOptions = {
    from: '"Team FOUR" <xx@gmail.com>', // sender address
    to: maillist, // list of receivers
    subject: 'Contact Details', // Subject line
    html: '<h1>Information</h1>' + '<br>' +
              '<h2>Name: </h2><h3>' + req.body.name + '</h3><br>' +
              '<h2>Phone: </h2><h3>' + req.body.phone + '</h3><br>' +
              '<h2>Quantity: </h2><h3>' + req.body.qty + '</h3><br>' +
              '<h2>Product Id: </h2><h3>' + req.body.id + '</h3><br>' +
              '<h3>Email: </h2><h3>' + req.body.email + '</h3><br>'/// plain text body

  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response); ;
    res.redirect('/store');
  });
});

app.post('/insertproduct', function (req, res) {
  Product.create(client,{
    product_name: req.body.name,
    product_desc: req.body.description,
    product_tagline: req.body.tagline,
    product_price: req.body.price,
    product_warranty: req.body.warrranty,
    product_category: req.body.category,
    product_brand: req.body.brand,
    product_image: req.body.image
  },function(product){
    if(product == 'SUCCESS'){
      console.log('INSERTED');
      res.redirect('/store');}
    else if (product == 'ERROR'){
      res.render('error',{
      error : 'PRODUCT',
      page : 'product'
      });
    }
  });
});

app.post('/insertcategory', function (req, res) {
  Category.create(client,{
    category_name: req.body.name
  },function(category){
    if(category == 'SUCCESS'){
      console.log('INSERTED');
      res.redirect('/categories');}
    else if (category == 'ERROR'){
      res.render('error',{
      error : 'CATEGORY',
      page : 'category'
      });
    }
  });
});

app.post('/insertbrand', function (req, res) {
  Brand.create(client,{
    brand_name: req.body.name,
    brand_desc: req.body.description
      },function(brand){
    if(brand == 'SUCCESS'){
      console.log('INSERTED');
      res.redirect('/brands');}
    else if (brand == 'ERROR'){
      res.render('error',{
      error : 'BRAND',
      page : 'brand'
      });
    }
  });

});
app.post('/updateproduct/:id', function (req, res) {
  client.query("UPDATE products SET name = '" + req.body.productsname + "', descriptions = '" + req.body.productsdesc + "', tagline = '" + req.body.productstag + "', price = '" + req.body.productsprice + "', warranty = '" + req.body.productswarranty + "',category_id = '" + req.body.category + "', brand_id = '" + req.body.brand + "', img = '" + req.body.productsimg + "'WHERE id = '" + req.params.id + "' ;");
  client.query("UPDATE products_brand SET description = '" + req.body.branddesc + "' WHERE id ='" + req.params.id + "';");

  res.redirect('/store');
});

app.post('/send-orders', function (req, res) {
  client.query("INSERT INTO customer (email, first_name, last_name,street,municipality,province,zipcode) VALUES ('" + req.body.email + "', '" + req.body.fname + "', '" + req.body.lname + "', '" + req.body.street + "', '" + req.body.mun + "', '" + req.body.province + "', '" + req.body.zip + "') ON CONFLICT (email) DO UPDATE SET first_name = ('" + req.body.fname + "'), last_name = ('" + req.body.lname + "'), street = ('" + req.body.street + "'),municipality = ('" + req.body.mun + "'),province = ('" + req.body.province + "'),zipcode = ('" + req.body.zip + "') WHERE customer.email ='" + req.body.email + "';");
  client.query("SELECT id from customer WHERE email = '" + req.body.email + "';")
    .then((results) => {
      var id = results.rows[0].id;
      console.log(id);
      client.query("INSERT INTO orders (customer_id,product_id,quantity) VALUES ('" + id + "','" + req.body.productsid + "','" + req.body.qty + "')")
        .then((results) => {
          var maillist = ['teamfourdbms@gmail.com', req.body.email];
          var transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
              user: 'teamfourdbms@gmail.com',
              pass: 'aguilarliberato04'
            }
          });
          const mailOptions = {
            from: '"Team FOUR" <teamfourdbms@gmail.com>', // sender address
            to: maillist, // list of receivers
            subject: 'Order Details', // Subject line
            html:
         '<table >' +
           ' <thead>' +
              '<tr>' +
               '<th>Customer</th>' +
               '<th>Name</th>' +
               '<th>Email</th>' +
               '<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>' +
               '<th>Product</th>' +
               '<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>' +
               '<th>Quantity</th>' +
            '</thead>' +
            '<tr>' +

              '<td>' + req.body.fname + '</td>' +
              '<td>' + req.body.lname + '</td>' +
              '<td>' + req.body.email + '</td>' +
               '<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
             ' <td>' + req.body.productsname + '</td>' +
             '<td>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
             ' <td>' + req.body.qty + '</td>' +
              '</tr>' +
           ' </tbody>'
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              return console.log(error);
            }
            console.log('Message %s sent: %s', info.messageId, info.response); ;
            res.redirect('/store');
          });
        })
        .catch((err) => {
          console.log('error', err);
          res.send('Error!');
        });
    })
    .catch((err) => {
      console.log('error', err);
      res.send('Error!');
    });
});

app.listen(app.get('port'), function () {
  console.log('Server started');
});
