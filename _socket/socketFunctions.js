const censorWord = require('../services/censorBleep');


const handleSocket = (socket) => {
    socket.on('setup',(userData)=>{
        socket.join(userData);
        socket.emit('connected');
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

        socket.to(roomID).emit('newMessage',newData);
      });
}

module.exports = {handleSocket};