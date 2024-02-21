const Message = require('../models/messages');


async function getMessages(req, res){
  const roomID = req.body.roomID;
  const messages = await Message.find({roomID});
  res.json(messages);
}

// async function setConnection(req, res){
//   const {from, message, roomID} = req.body;
//   const newMessage = await Message.create({from, message, roomID});
//   res.json(newMessage);
// }

async function createMessage(req, res){
  const {message, roomID} = req.body;
  const from = req.user._id;
  const newMessage = await Message.create({from, message, roomID});
  res.json(newMessage);
}

module.exports={
    getMessages,
    createMessage
}