const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const UserSchema = new Schema(
    {
        username: { type: String, default: '' },
        given_name: { type: String, default: '' },
        family_name: { type: String, default: '' },
        email: { type: String, default: '', unique: true },
        email_verified: { type: Boolean, default: 'false' },
        phone: { type: String, default: '' },
        password: { type: String, default: '' },
        picture: { type: String, default: ''},
        role: {type: String, default: ''},
        gender: {type: String, default: "None"},
        slug: { type: String, slug: 'email', unique: true },
    },
    {
        timestamps: true,
    },
)

// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('user', UserSchema)
