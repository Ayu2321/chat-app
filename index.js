const http  = require('http');
const express  = require('express');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages.js');
const {userjoin, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users.js');

//set static folder
app.use(express.static(path.join(__dirname,'public')));
const botname = 'Admin';
//runs when client connects
io.on('connection',socket => {
  socket.on('joinroom', ({ username, room}) => {
    const user = userjoin(socket.id, username, room);
    socket.join(user.room);
    //welcome current user
      socket.emit('message', formatMessage(botname,'welcome to the chat'))

    //broadcast when a user connects
      socket.broadcast.to(user.room).emit('message' , formatMessage(botname,`${user.username } has joined the chat`));
    //send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
  });



  //listen the chat message
  socket.on('chatMessage',(msg) => {
    const user = getCurrentUser(socket.id);
    console.log("kbfckjbfdkb", user);
    io.to(user.room).emit('message',formatMessage(user.username, msg));


  });
  //runs when clients disconnects
  socket.on('disconnect', () => {
    const user = userLeaves(socket.id);
    console.log('userLeaves', user);
    if(user)
      {
        io.to(user.room).emit('message' , formatMessage(botname,`${user.username }has left the chat`));
      // io.emit('message' , formatMessage(botname,'user has left the chat'));

    //send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }

  })
} );

const port = 8080 || process.env.port;

server.listen(port, err =>{
  if(err){
    console.log("Cannot listen on port", port);
  }
  console.log("Server is listening on port", port);
});
