const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { Client } = require('pg');

/**const client = new Client({
	database: 'd2enpmgi8ggjdb',
	user: 'vbyfyfmjyihrag',
	password: '8b6115724473fbf2d9ffdedcd8dd3367358859936278f63166f14f2c94ca9342',
	host: 'ec2-54-235-193-34.compute-1.amazonaws.com',
	port: 5432
});
client.connect();
**/

const app = express();
// tell express which folder is a static/public folder
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');
app.set('port',(process.env.PORT|| 3000));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(req, res) {
	res.render('home',{
		content: 'This is some content',
		published: true,

	});
});

app.get('/about', function(req, res) {
	//res.send('<h1>About Page</h1>');
	res.sendFile(__dirname + 'public/305109.jpg');
});

app.get('/user/:userName', function(req, res) {
	const userName = req.params.userName;
	res.send('<h1>Hi,' + userName + '!!</h1>');
});

app.get('/product', function(req, res) {
	res.render('product', {
		title: 'Top Products'
	});
});

app.get('/member/1', function(req, res){
	res.render('member', {
		name: 'Ralph Liberato',
		email: 'ralph@gmail.com',
		phone: '09982311111',
		imageurl: '/bnw.jpg',
		skills: ['Web Development', 'Game Dev','Java Programming']

	})
});

app.get('/member/2', function(req, res){
	res.render('member', {
		name: 'Athena Bernadette Aguilar',
		email: 'athena@gmail.com',
		phone: '09981239999',
		imageurl: '/ny.jpg',
		skills: ['Front End', 'Android Development', 'Web Programming']

	});
});

/** connect to database
app.get('/products',(req, res)=>{

	
	 client.query('SELECT * FROM tbl_products;')
	.then((results)=>{
	    console.log('results?', results);
		res.render('products', results);
	})
	.catch((err) => {
		console.log('error',err);
		res.send('Error!');
	});
});**/

app.listen(app.get('port'), function() {
	console.log('Server started at port 3000');
});
