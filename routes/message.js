const router = require('express').Router();
const {auth} = require('../services/Auth')
const {getMessages,createMessage} = require('../controllers/message');
const { set } = require('mongoose');

router.post('/',auth, getMessages);
router.post('/sendmessage', auth, createMessage);
//router.post('/createMessage',auth, getMessages);


module.exports = router;