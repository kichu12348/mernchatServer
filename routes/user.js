const router = require('express').Router();
const {handleSignUp,handleLogin,getData,queryContact,addContact,getContactList,deleteContact} = require('../controllers/user');
const {checkAuth,auth} = require('../services/Auth');

router.post('/signup',handleSignUp);
router.post('/login',handleLogin);
router.post('/auth',checkAuth);
router.post('/getData',auth,getData);
router.post('/queryContact',auth,queryContact);
router.post('/addContact',auth,addContact);
router.post('/getContactList',auth,getContactList);
router.post('/deleteContact',auth,deleteContact);


module.exports = router;