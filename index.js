import { Server } from "socket.io";
import axios from "axios";
const dotenv = require('dotenv');
dotenv.config();
const io = new Server({
  cors: {
    origin: "http://127.0.0.1:3333",
  },
});

let onlineUsers = [];

const addNewUser = (user, socketId) => {
  !onlineUsers.some((users) => users.user === user) &&
    onlineUsers.push({ user, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (id) => {

  return onlineUsers.find((users) => users.user === id);
};

io.on("connection", (socket) => {
  socket.on("newUser", (user) => {
    addNewUser(user, socket.id);
  });

  socket.on("sendNotification", ({ id, action }) => {
    console.log(id, action)
    id.map((data) => {
      const receiver = getUser(data);
      console.log(receiver, onlineUsers, 'recever')
      if (receiver != undefined)
        io.to(receiver.socketId).emit("getNotification", {
          id,
          action
        });
    })

  });

  // socket.on("sendText", ({ senderName, receiverName, text }) => {
  //   const receiver = getUser(receiverName);
  //   io.to(receiver.socketId).emit("getText", {
  //     senderName,
  //     text,
  //   });
  // });

  socket.on("disconnect", () => {
    console.log(socket.id, 'disconnect')
    removeUser(socket.id);
    console.log(onlineUsers)
  });
});

io.listen(process.env.PORT || 6000);
