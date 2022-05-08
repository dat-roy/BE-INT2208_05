const mongoose = require('mongoose');
const {mongoURI} = require('./uri.json');

async function connect() {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connect database successfully');
    } catch (error) {
        console.log(error);
        console.log('Connect database failed');
    }
}

module.exports = { connect };
