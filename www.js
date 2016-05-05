'use strict';

var express = require('express'),
    path = require('path'),
    routes_index = require('./routes/index'),
    routes_area = require('./routes/area'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    mongoose = require('mongoose'),
    db = mongoose.connection,
    bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/tcc');

db.on('error', function(){
  console.log('Database: error.');
}).once('open', function() {
  console.log('Database: success.');
});

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', true);
app.set('port', process.env.PORT || 3000);

app.use(express.static(path.join(__dirname, '/')));
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes_index);
app.use('/area', routes_area);

app.use('/socket', function(req, res, next){
	io.sockets.emit('news', { key: 1 });
	res.sendStatus(200);
});

var server = server.listen(app.get('port'), function(){
	console.log('WEB started.');
});