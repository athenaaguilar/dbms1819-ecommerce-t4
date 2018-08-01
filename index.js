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

app.get('/product/:id', function(req, res) {
	 client.query('SELECT * FROM tbl_products;')
	.then((results)=>{
	    console.log('results?', results);
		res.render('product',{
		title: 'Product 1 ',
		name: results.rows[req.params.id-1].name,
		type: results.rows[req.params.id-1].type,
		description: results.rows[req.params.id-1].description,
		brand: results.rows[req.params.id-1].brand,
		price: results.rows[req.params.id-1].price,
		img: '/images/'+results.rows[req.params.id-1].pic
	})
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
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
          to: 'teamfourdbms@gmail.com', // list of receivers
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
