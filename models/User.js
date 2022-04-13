const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
name:{
     type: String
},
email:{
    type: String
},
role:{
    type: String
},
phone:{
    type: String
},
password:{
    type: String
}} , {timestamps: true}
)


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
const User = mongoose.model('User', userSchema);
module.exports = User;