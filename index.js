const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user');
const messageRouter = require('./routes/message');
const {handleSocket} = require('./_socket/socketFunctions');
const cors = require('cors');


require('dotenv').config();

//cors
app.use(cors(
    {
        origin:process.env.CLIENT_URL,
        credentials:true,
    }
));

//socket.io


//port
const port = process.env.PORT;

//connect to the database
const {connectDB} = require('./services/connect');
connectDB(process.env.MONGO_URL);



//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

//routes
app.use('/user',userRouter);
app.use('/message',messageRouter);
app.get('/',(req,res)=>{
    res.send('Hello World');
})

const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port} 😎`);
})

const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:process.env.CLIENT_URL,
    }
});

handleSocket(io);

