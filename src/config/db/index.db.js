const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connect database successfully');
    } catch (error) {
        console.log(error);
        console.log('Connect database failed');
    }
}

module.exports = { connect };
