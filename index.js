const express = require('express');
const bole = require('bole');
const path = require('path');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

bole.output({level: 'debug', stream: process.stdout});
const log = bole('server');

log.info('server process starting');

// Register '.html' extension with The Mustache Express
app.engine('html', mustacheExpress());

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');

// Register body parsing
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true,
}));

// Load the routes
app.use(express.static('public'));
app.use(express.static('node_modules/bootstrap/dist'));

// Home Page
app.use(require('./components/home/index.js')(io));

module.exports = {
  app: app,
  http: http,
  log: log,
};
