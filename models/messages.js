const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
   from:{
         type: String,
         required: true
    },
    message:{
        type: String,
    },
     roomID:{
          type: String,
          required: true
     },
}, {timestamps: true})

const message = model('message', messageSchema);

module.exports = message;