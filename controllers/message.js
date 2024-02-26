const Message = require('../models/messages');
const bleep = require('../services/censorBleep');


async function getMessages(req, res){
  const roomID = req.body.roomID;
  const messages = await Message.find({roomID});
  res.json(messages);
}


async function createMessage(req, res){
  const {message, roomID} = req.body;
  const censoredMsg = await bleep(message);
  const from = req.user._id;
  const newMessage = await Message.create({from, message:censoredMsg, roomID});
  res.json(newMessage);
}

module.exports={
    getMessages,
    createMessage
}