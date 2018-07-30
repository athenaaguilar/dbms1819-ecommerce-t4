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
		content: 'This is some content',
		published: true,

	});
});

app.get('/product/1', function(req, res) {
	res.render('product', {
		title: 'Product 1 ',
		name: 'The Starry Night',
		type: 'Painting',
		description: 'Painted 1889',
		brand: 'Vincent Van Gogh',
		price: '$23M',
		img: 'starrynight.jpg'
	});
});

app.get('/product/2', function(req, res) {
	res.render('product', {
		title: 'Product 2 ',
		name: 'Mona Lisa',
		type: 'Painting',
		description: 'Painted 1503',
		brand: 'Leonardo Da Vinci',
		price: '$16M',
		img: 'monalisa.jpg'
	});
});

app.get('/product/3', function(req, res) {
	res.render('product', {
		title: 'Product 3 ',
		name: 'The Last Supper',
		type: 'Tempera Paint',
		description: 'Painted 1498',
		brand: 'Leonardo Da Vinci',
		price: '$30M',
		img: 'lastsupper.jpg'
	});
});

app.get('/product/4', function(req, res) {
	res.render('product', {
		title: 'Product 4 ',
		name: 'The Spolarium',
		type: 'Oil Paint',
		description: 'Painted 1884',
		brand: 'Juan Luna',
		price: '$10M',
		img: 'spolarium.jpg'
	});
});

app.get('/product/5', function(req, res) {
	res.render('product', {
		title: 'Product 5 ',
		name: 'The Persistence of Memory',
		type: 'Oil Paint',
		description: 'Painted 1931',
		brand: 'Salvador Dali',
		price: '$20M',
		img: 'memory.jpg'
	});
});

app.get('/product/6', function(req, res) {
	res.render('product', {
		title: 'Product 6 ',
	    name: 'The Creation of Adam',
		type: 'Plaster Paint',
		description: 'Painted 1508–1512',
		brand: 'Michelangelo Buonarroti',
		price: '$120M',
		img: 'creation.jpg'
	});
});

app.get('/store',(req, res)=>{

	
	 client.query('SELECT * FROM tbl_products;')
	.then((results)=>{
	    console.log('results?', results);
		res.render('store', results);
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
          to: 'athena.aguilar00@gmail.com', // list of receivers
          subject: 'Contact Details', // Subject line
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

app.listen(app.get('port'), function() {
	console.log('Server started');
});
