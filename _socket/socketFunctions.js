const censorWord = require('../services/censorBleep');


const handleSocket = (io) => {
    io.on('connection',socket=>{


    socket.on('setup',({userId})=>{
        socket.join(userId);
    })

    socket.on('joinRoom',(roomID)=>{
        socket.join(roomID);
    })

    socket.on('message', async ({message,roomID,from}) => {
        const newData = {
            message:await censorWord(message),
            from,
            roomID
        }

        io.to(roomID).emit('newMessage',newData);
      });
      
      
      
      socket.on('contactAdded',({id,userData})=>{
        io.to(id).emit('newContact',userData);
    })

    socket.on('contactDeleted',({id,userId,name})=>{
        io.to(id).emit('deleteContact',{userId,name});
    })

    })


    
}

module.exports = {handleSocket};