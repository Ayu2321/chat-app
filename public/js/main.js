const socket = io();

//get username and room from url
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

//join room
  socket.emit('joinroom', {username, room});

const chatMessages = document.querySelector('.chat-messages');
var app = angular.module('chatApp', []);

app.controller('chatCtrl', ["$scope", function($scope) {
  $scope.messages = [];
  //get room and users
    socket.on('roomUsers', ({room, users}) =>{
      $scope.roomName = room;
      $scope.usersName = users;
      // outputRoomName(room);
      console.log("roomm", room);
      // outputUsers(users);
      $scope.$digest();

    });
  //message from server
  socket.on('message', message => {
    outputMessage(message);

    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
  $scope.sendMessage = function() {
    const msg = $scope.chat;
    socket.emit('chatMessage', msg);
    $scope.chat = "";
  }

  // send output message to dom
  function outputMessage(message) {
    $scope.messages.push(message);
    $scope.$digest();
  }
}]);
