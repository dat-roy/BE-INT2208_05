const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const ChatSchema = new Schema({
    _id: {type: mongoose.objectID},
    member: [{
        userID: {type: mongoose.objectID},
    }],
    messages: [
        {
            sender: {type: mongoose.objectID},
            message: {type: String},
            seen_1: {type: Boolean},
            seen_2: {type: Boolean},
        },
        {
            timestamp: true,
        },
    ],
    total_messages: {type: Number},
});

module.exports = mongoose.model('chat', ChatSchema);