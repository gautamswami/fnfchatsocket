// const io = require("socket.io")(8900,{
//     cors:{
//         origin:"*"
//     }
// });

// io.on("connection",(socket)=>{
//     console.log("A USER CONNECCTD")
// })
const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:19006/",
    },
  });
  
  let users = [];
  
  const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => { 
    console.log(userId,'user id to find in',users)
    return users.find((user) => user.userId === userId);
  };
  console.log(`connected at ${process.env.PORT}`)
  
  io.on("connection", (socket) => {
    //when ceonnect
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      io.to(user.socketId).emit("getMessage", {
        senderId,
        text,
        receiverId
      });
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });