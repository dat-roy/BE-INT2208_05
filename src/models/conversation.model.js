const { type } = require('express/lib/response');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const ConversationSchema = new Schema({
    member: {
        userID_1: {type: mongoose.ObjectId},
        userID_2: {type: mongoose.ObjectId}
    },
    messages: [
        {
            sender: { type: mongoose.ObjectId },
            message: { type: String },
            receiver_seen: {type: Boolean, default: false},
            sentAt: {type: Date},
        }
    ],
});


// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('conversation', ConversationSchema)