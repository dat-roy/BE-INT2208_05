const mongoose = require('mongoose');


async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/mydb');
        console.log('Connect database successfully');
    } catch (error) {
        console.log('Connect database failed');
    }
}

module.exports = { connect };
