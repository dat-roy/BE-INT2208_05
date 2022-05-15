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



const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);


//Connect to MongoDB
const db = require('./config/db/index.db');
const checkSession = require('./middlewares/check-session.js');
const conversationModel = require('./models/conversation.model.js');

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


const ConversationModel = require('./models/conversation.model');
let roomNumber;

io.on('connection', function(socket){
   socket.on('setRoom', function(data) {
      roomNumber = data;
      socket.join(roomNumber);
   });
   console.log('A user connected ' + roomNumber);
   socket.on('msg', function(data){
      io.sockets.in(roomNumber).emit('newmsg', data);
      const room_id = data.room_id;
      const sender_id = data.user;
      const message = data.message;
      console.log("Room id & Sender_id & message: ", room_id, sender_id, message);
      ConversationModel.findByIdAndUpdate(room_id, {
         $push: {
            messages: {
               sender: sender_id, 
               message: message,
               sentAt: new Date(),
            }
         }
      }).then(() =>{
         console.log("Save a new message successfully");
      })
      .catch((err) => {
         console.log("Error when saving a new msg: ", err.message);
      })
     
   })
});

server.listen(PORT, hostname, () => {
    console.log(`Running on port ${PORT}`);
})
