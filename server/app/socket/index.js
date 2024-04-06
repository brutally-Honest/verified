const { Server } = require("socket.io");
const {server}=require('../app')
const unitsCltr = require("../controllers/unitsCltr");

const startSocket=()=>{
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods:["GET","POST"]
        },
    });
    
console.log("Socket Connection Initialized");
let users = [];
const toggles = [];
let i = 0;

try{
    io.on("connection", (socket) => {
        //sent from client connecting to socket after login
        socket.on("userAuthId", (userData) => {
          const index = users.findIndex((e) => e.userId === userData.id);
          if (index > -1) {
            users.splice(index, 1);
          }
          users.push({
            userId: userData.id,
            socketId: socket.id,
            role: userData.role,
          });
          console.log("Users", users);
        });
      
        //sent from gaurd
        socket.on("permission", async (formData) => {
          console.log('Visitor details sent from gaurd!');
          formData.socket = socket.id;
          toggles[i] = { id: "", switch: "" };
          toggles[i].id = formData.visitorName + formData.visitorPhoneNumber;
      
          const members = await unitsCltr.getMembers(formData.unit);
          members.forEach((e) => {
            const user = users.find(
              (ele) => ele.userId === String(e.memberId)
            );
            // sent to members
            if(user)
            {
              console.log('Emitting socket to user- ',user);
              io.to(user.socketId).emit("s-Permission", formData);
            }
          });
          i = i + 1;
        });
      
        socket.on("permission acknowledged", (data) => {
          const index = toggles.findIndex(
            (e) => e.id == data.visitorName + data.visitorPhoneNumber
          );
          if (data.visitorName + data.visitorPhoneNumber == toggles[index].id)
            if (toggles[index].switch !== "permission given") {
              if(data.video){
                console.log('Video requested by member');
                const videoRequestedMember=users.find(e=>e.socketId===socket.id).userId
                io.to(data.socket).emit('s-joinVideoCall',{approvedBy:videoRequestedMember})
              }else{
                io.to(data.socket).emit("s-Final", data);
              }
              toggles[index].switch = "permission given";
            }
        });
      
        socket.on('expectedVisitor',(data)=>{
          io.emit('s-expectedVisitor',data)
        })
      
        socket.on('joinVideoCall',()=>{
          const id=users.find(e=>e.socketId===socket.id)?.userId
          io.to('1').emit('userJoined',{userSocket:socket.id,userId:id})
          socket.join('1')
        })
      
        socket.on("userCall", ({ to, offer }) => {
          io.to(to).emit("incommingCall", { from: socket.id, offer });
        });
      
        socket.on("callAccepted", ({ to, ans }) => {
          io.to(to).emit("callAccepted", { from: socket.id, ans });
        });
      
        socket.on("peerNegotiationNeeded", ({ to, offer }) => {
          io.to(to).emit("peerNegotiationNeeded", { from: socket.id, offer });
        });
      
        socket.on("peerNegotiationDone", ({ to, ans }) => {
          io.to(to).emit("peerNegotiationFinal", { from: socket.id, ans });
        });
      
        socket.on("disconnect", () => {
          console.log("Socket Disconnected",socket.id);
          const disconnectedUser = users.findIndex((e) => e.socketId == socket.id);
          if (disconnectedUser > -1) users.splice(disconnectedUser, 1);
        });
      });
}catch(error){
    console.log("GG sockets");
    console.log(error);
}

}

module.exports={startSocket}