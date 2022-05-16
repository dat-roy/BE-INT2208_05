const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const initRoutes = require('./routes/index.route.js');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

//Get hostname & port
const backendHostName = process.env.BACKEND_HOST;
const frontendHostName = process.env.FRONTEND_HOST;
const FE_PORT = process.env.FE_PORT || 3000;
const BE_PORT = process.env.PORT || 3030;

const corsOptions = {
    origin: `${frontendHostName}`,
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

//Initialize app
const app = express();

app.use(cors(corsOptions));

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

app.listen(BE_PORT, () => {
    console.log(`Running on port ${BE_PORT}`);
})
