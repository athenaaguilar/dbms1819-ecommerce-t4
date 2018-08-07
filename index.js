const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { Client } = require('pg');
const nodemailer = require('nodemailer');
const bodyParser = require("body-parser");
const hbs = require('nodemailer-express-handlebars');

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
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.set('port',(process.env.PORT|| 3000));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/', function(req, res) {
	res.render('home',{
	});
});

app.get('/products/:id', function(req, res) {
	 client.query('SELECT products.id AS productsid,products.img AS productsimg,products.name AS productsname, products.descriptions AS productsdesc,products.tagline AS productstag,products.price AS productsprice,products.warranty AS productswarranty,products_brand.name AS productsbrand,products_brand.description AS branddesc,products_category.name AS categoryname FROM products INNER JOIN products_brand ON products.brand_id=products_brand.id INNER JOIN products_category ON products.category_id=products_category.id WHERE products.id = '+req.params.id+'; ')
	.then((results)=>{
		console.log ('results?',results);
		res.render('product',{
		name: results.rows[0].productsname,
		description: results.rows[0].productsdesc,
    	tagline: results.rows[0].productstag,
		price: results.rows[0].productsprice,
		warranty: results.rows[0].productswarranty,
		img: results.rows[0].productsimg,
		brandname: results.rows[0].productsbrand,
		branddesc: results.rows[0].branddesc,
		category: results.rows[0].categoryname,
		id: results.rows[0].productsid
	})
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});
});

app.get('/store',(req, res)=>{
	
	 client.query('SELECT * FROM products ORDER by id ASC;')
	.then((results)=>{
	    console.log('results?', results);
		res.render('store', results);
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});
});

app.get('/brand/create', function(req, res) {
	res.render('create_brand',{
	});
});

app.get('/category/create', function(req, res) {
	res.render('create_category',{
	});
});

app.get('/product/create', function(req, res) {
	 var category = []; 
	 var brand = [];
	 var both =[];
	 client.query('SELECT * FROM products_brand')
	.then((result)=>{
	    brand = result.rows;
	    console.log('brand:',brand);
	     both.push(brand);
	})
	.catch((err) => {       
		console.log('error',err);
		res.send('Error!');
	});
    client.query('SELECT * FROM products_category')
	.then((result)=>{
	    category = result.rows;
	    both.push(category);
	    console.log(category);
	    console.log(both);
		res.render('create_product',{
			rows: both
		});
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});

});
 


app.get('/brands', function(req, res) {
		 client.query('SELECT * FROM products_brand')
	.then((result)=>{
	    console.log('results?', result);
		res.render('brand_list', result);
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});

	});

app.get('/categories', function(req, res) {
		 client.query('SELECT * FROM products_category')
	.then((result)=>{
	    console.log('results?', result);
		res.render('category_list', result);
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});

	});

app.get('/product/update/:id', function(req, res) {
     var category = []; 
	 var brand = [];
	 var both =[];
	  client.query('SELECT * FROM products_brand;')
	.then((result)=>{
		brand = result.rows;
	    console.log('brand:',brand);
	    both.push(brand);
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});
    client.query('SELECT * FROM products_category;')
	.then((result)=>{
		category = result.rows;
	  
	    both.push(category);
	      console.log('both',both);
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});
	 client.query('SELECT products.id AS productsid,products.img AS productsimg,products.name AS productsname, products.descriptions AS productsdesc,products.tagline AS productstag,products.price AS productsprice,products.warranty AS productswarranty,products_brand.name AS productsbrand,products_brand.description AS branddesc,products_category.name AS categoryname FROM products INNER JOIN products_brand ON products.brand_id=products_brand.id INNER JOIN products_category ON products.category_id=products_category.id WHERE products.id = '+req.params.id+';')
	.then((result)=>{
		res.render('update_product', {
			rows: result.rows[0],
			brand: both
		});
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});

	});


app.post('/send-email', function (req, res) {
      var transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
              user: 'teamfourdbms@gmail.com',
              pass: 'aguilarliberato'
          }
      });
      const mailOptions = {
          from: '"Team FOUR" <xx@gmail.com>', // sender address
          to: 'teamfourdbms@gmail.com', // list of receivers
          subject: 'Contact Detail	s', // Subject line
          html: '<h1>Information</h1>'+'<br>'+
          		'<h2>Name: </h2><h3>'+req.body.name+'</h3><br>'+
          		'<h2>Phone: </h2><h3>'+req.body.phone+'</h3><br>'+
          		'<h2>Quantity: </h2><h3>'+req.body.qty+'</h3><br>'+
          		'<h2>Product Id: </h2><h3>'+req.body.id+'</h3><br>'+
          		'<h3>Email: </h2><h3>'+req.body.email+'</h3><br>'/// plain text body
 
      };

      transporter.sendMail(mailOptions, (error, info) => {	
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);;
          res.redirect('/store');
          });
      });	

app.post('/insertproduct', function(req, res) {
	client.query("INSERT INTO products (name,descriptions,tagline,price,warranty,category_id,brand_id,img) VALUES ('"+req.body.name+"', '"+req.body.description+"', '"+req.body.tagline+"', '"+req.body.price+"', '"+req.body.warranty+"', '"+req.body.category+"', '"+req.body.brand+"','"+req.body.image+"')");
	res.redirect('/store');
});

app.post	('/insertcategory', function(req, res) {
	client.query("INSERT INTO products_category (name) VALUES ('"+req.body.name+"')");
	res.redirect('/categories');
});

app.post('/insertbrand', function(req, res) {
	client.query("INSERT INTO products_brand (name,description) VALUES ('"+req.body.name+"','"+req.body.description+"')");
	res.redirect('/brands');
});
app.post('/updateproduct/:id', function(req, res) {
	client.query("UPDATE products SET name = '"+req.body.productsname+"', descriptions = '"+req.body.productsdesc+"', tagline = '"+req.body.productstag+"', price = '"+req.body.productsprice+"', warranty = '"+req.body.productswarranty+"',category_id = '"+req.body.category+"', brand_id = '"+req.body.brand+"', img = '"+req.body.productsimg+"'WHERE id = '"+req.params.id+"' ;");
	client.query("UPDATE products_brand SET description = '"+req.body.branddesc+"' WHERE id ='"+req.params.id+"';");
	
	res.redirect('/store');
});



app.listen(app.get('port'), function() {
	console.log('Server started');
});
