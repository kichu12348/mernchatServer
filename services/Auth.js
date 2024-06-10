const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_CODE
const User = require('../models/user');

async function createToken(id){
    const token = await jwt.sign(id, secret);
    return token;
}

async function verifyToken(token){
    const id = await jwt.verify(token, secret);
    return await User.findById(id);
}

async function auth(req,res,next){
    const token = req.body.token;
    if(!token) return res.status(401).json({response:false, message:'Unauthorized'});
    const user = await verifyToken(token);
    if(!user) return res.status(401).json({response:false, message:'Unauthorized'});
    req.user = user;
    next();
}

async function checkAuth(req,res){
    const token = req.body.token;
    if(!token) return res.json({response:false});
    const user = await verifyToken(token);
    if(!user) return res.json({response:false});
    res.json({response:true, name:user.user, email:user.email,pic:user.profilePic});
}

module.exports = {createToken, verifyToken, auth, checkAuth};