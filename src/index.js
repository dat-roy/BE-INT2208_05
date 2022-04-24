const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const initRoutes = require('./routes/index.route.js');

//Define hostname & port
const hostname = '127.0.0.1';
const PORT = 3000;

//Initialize app
const app = express();
//Connect to MongoDB
const db = require('./config/db/index.db');
db.connect();

//------ Middleware -----//
//[express] Serving static files in express
app.use(express.static(path.join(__dirname, 'public')));  
//[cookie-parser] Parse cookie header
app.use(cookieParser());        
//[body-parser] Parse request object as a JSON object: application/json
app.use(bodyParser.json()); 
//[body-parser] Parse urlencoded bodies: application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//Set view engine
app.set('view engine', 'ejs');
//Set views folder path
app.set('views', path.join(__dirname, 'views'));

//Routes init
initRoutes(app);

app.listen(PORT, hostname, () => {
    console.log(`Running on port ${PORT}`);
})
