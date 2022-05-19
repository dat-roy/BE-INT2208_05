const socket = io.connect('http://localhost:3030');
let user_id;
let room_id;
let user_name;

function initConversation(sender_id, conv_id, sender_name){
   room_id = conv_id;
   user_id = sender_id;
   user_name = sender_name;
   socket.emit('setRoom', conv_id);
};

socket.on('userExists', function(data){
   document.getElementById('error-container').innerHTML = data;
});
async function sendMessage(){
   let msg = document.getElementById('message').value;
   if(msg){
     await socket.emit('msg', {message: msg, user: user_name,userId: user_id, room_id,});
   }
}
socket.on('newmsg', function(data){
   if(user_id){
      document.getElementById('message-container').innerHTML +='<div><b>' + data.user + '</b> : ' + data.message + ' (new) </div>'
   }
})

