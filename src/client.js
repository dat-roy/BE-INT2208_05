const socket = io.connect('http://localhost:3000');
let user;
let room_id;

//
function initConversation(sender, conv_id){
   room_id = conv_id;
   user = sender;
   socket.emit('setRoom', conv_id);
};

socket.on('userExists', function(data){
   document.getElementById('error-container').innerHTML = data;
});
function sendMessage(){
   let msg = document.getElementById('message').value;
   if(msg){
      socket.emit('msg', {message: msg, user: user, room_id,});
   }
}
socket.on('newmsg', function(data){
   if(user){
      document.getElementById('message-container').innerHTML +='<div><b>' + data.user + '</b>: ' + data.message + '</div>'
   }
})

