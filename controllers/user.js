const User = require('../models/user');
const Message = require('../models/messages');
const crypto = require('crypto');
const {createToken} = require('../services/Auth');
const fetch = require('isomorphic-fetch');
const shortid = require('shortid');


//makes avatar for user


async function makeAvatar(user){
    const apikey= 'CglVv3piOwAuoJ'; //api key for the avatar service
    const url = `https://api.multiavatar.com/${user}.svg?apikey=${apikey}`;
    const resp = await fetch(url).then(res=>res.text());
    return resp;
}

//handles the sign up
async function handleSignUp(req,res){
    const {user, email, password} = req.body;

    //check if user or email already exists
    const checkUser = {
        name: await User.findOne({user}),
        email: await User.findOne({email})
    }

    //if user or email already exists, return a message
    if(checkUser.name || checkUser.email){
        return res.json({response:false, message:'Username or email already exists'})
    }
        //create the user
        const svg = await makeAvatar(user);
        const newUser = await User.create({
            user,
            email,
            password,
            profilePic:svg,
        });
        
        //create a token for the user
        const token = await createToken(newUser._id.toString());
        
        
        return res.json({response:true, message:'User created successfully',token, name:newUser.user, email:newUser.email, profilePic:newUser.profilePic})
    
   
}


//handles the login
async function handleLogin(req,res){
    const {email, password} = req.body;
    const checkUser = await User.findOne({email});
    if(!checkUser) return res.json({response:false, message:'user not found'});

    
    const hash = crypto.createHmac('sha512',checkUser.salt).update(password).digest('hex');
    if(hash !== checkUser.password) return res.json({response:false, message:'wrong password'});
    const token = await createToken(checkUser._id.toString());
    return res.json({response:true, message:'User logged in successfully',token, name:checkUser.user, email:checkUser.email, profilePic:checkUser.profilePic})

}

//gets the user data
async function getData(req,res){
    const user = req.user;
    res.json({response:true, name:user.user, email:user.email, profilePic:user.profilePic, contact:user.contacts, id:user._id.toString()});
}

//query the contacts from db
async function queryContact(req,res){
    const {query} = req.body;
    const users = await User.find({user:{$regex:query}});
    res.json({response:true, names:users.map(user=>user.user), id:users.map(user=>user._id.toString()), profilePics:users.map(user=>user.profilePic)});
}

//add a contact to the user
async function addContact(req,res){
    const {id} = req.body;
    const user = req.user;
    const newContact = await User.findById(id);
    if(!newContact) return res.json({response:false, message:'user not found'});
    const checkContact = await User.findOne({_id:user._id.toString(), contacts:{$elemMatch:{contact:id}}});
    if(checkContact) return res.json({response:false, message:'contact already exists'});
    const rndID = shortid.generate();
    await User.findByIdAndUpdate(user._id.toString(),{$push:{contacts:{contact:newContact._id.toString(),roomID:rndID}}});
    await User.findByIdAndUpdate(newContact._id.toString(),{$push:{contacts:{contact:user._id.toString(),roomID:rndID}}});
    res.json({response:true , message:'contact added successfully', newContacts:{contact:newContact._id.toString(),roomid:rndID}});
}

//get the contact list of the user
async function getContactList(req, res) {
    const user = req.user;
    const contacts = await User.find({ _id: { $in: user.contacts.map((contact) => contact.contact) }});
    const resposneList = [];
    await Promise.all(
      contacts.map(async (contact) => {
        resposneList.push({
          name: contact.user,
          email: contact.email,
          profilePic: contact.profilePic,
          id: contact._id.toString(),
          roomID: user.contacts.find((c) => c.contact === contact._id.toString()).roomID,
        });
        
      })
    );
    
    res.json({response:true, contacts:resposneList});

    resposneList.length = 0; //clear the array
    
  }

//delete a contact from the user
async function deleteContact(req,res){
    const {id} = req.body;
    const user = req.user;
    await User.findByIdAndUpdate(user._id.toString(),{$pull:{contacts:{contact:id}}});
    await User.findByIdAndUpdate(id,{$pull:{contacts:{contact:user._id.toString()}}});
    await Message.deleteMany({roomID});
    return res.json({response:true, message:'contact deleted successfully'});
}
  


module.exports = {handleSignUp,handleLogin,getData,queryContact,addContact,getContactList,deleteContact};