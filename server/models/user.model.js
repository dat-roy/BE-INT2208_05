const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        username: { type: String, default: '', unique: true },
        given_name: { type: String, default: '' },
        family_name: { type: String, default: '' },
        email: { type: String, default: '', unique: true },
        phone: { type: String, default: '' },
        picture: { 
            name: {type: String, default: '',},
            image_url: {type: Boolean, default: 'false'},
        },
        role: {type: String, default: ''},
        gender: {type: String, default: 'other'},
        address: {type: String, default: ''},
        theme: {type: String, default: ''},
        slug: { type: String, slug: 'email', unique: true },
    },
    {
        timestamps: true,
    },
)

// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('user', UserSchema)