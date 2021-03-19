const users = [];

//join user to chat
function userjoin(id, username, room){
  const user = {id, username, room};
  users.push(user);
  return user;
}

//get current user
function getCurrentUser(id){
  return users.find(user =>
    user.id === id
  )
}

//user leaves
function userLeaves(id){
  const index = users.findIndex(user => user.id === id);
  if(index !== -1){
    return users.splice(index,1)[0];//0th index coz v just want to return the user and not the complete array
  }
}

//get user Room
function getRoomUsers(room){
  return users.filter(user => user.room === room);
}
module.exports = {
  userjoin,
  getCurrentUser,
  userLeaves,
  getRoomUsers
};
