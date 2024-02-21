const {connect} = require('mongoose');

async function connectDB(url) {
    await connect(url).then(() => {
        console.log('Connected to the MongoDB database 😎');
    }).catch((err) => {
        console.log('Error connecting to the database');
    });

}

module.exports = {connectDB};