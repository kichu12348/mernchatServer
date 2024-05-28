const censorWord = require('../utils/censorWord');


const handleSocket = (socket) => {
    socket.on('setup',(userData)=>{
        socket.join(userData);
        socket.emit('connected');
    })

    socket.on('joinRoom',(roomID)=>{
        socket.join(roomID);
    })

    socket.on('message', async (data) => {
        const roomID = data;
        const messages = await message.find({ roomID });
        io.to(roomID).emit('newMessage', messages);
      });
}

module.exports = {handleSocket};