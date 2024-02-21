const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const cors = require('cors');
const message = require('./models/messages');

require('dotenv').config();

//cors
app.use(cors(
    {
        origin:process.env.frontendURL,
        credentials:true
    }
));

//socket.io


//port
const port = process.env.PORT;

//connect to the database
const {connectDB} = require('./services/connect');
connectDB(process.env.MONGO_URl);



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

//routes
app.use('/user',userRouter);
app.use('/message',messageRouter);

const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port} 😎`);
})

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:process.env.frontendURL,
    }
});

io.on('connection',(socket)=>{

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
});

