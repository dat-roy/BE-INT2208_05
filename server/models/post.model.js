const {GenderOptions, PostStatus, RoomTypes} = require('../types/custom-types.js');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const InfoSchema = new Schema({ 
    room_area: {type: Number, default: null},
    expenses: {
        rental_price: {type: Number}, 
    },
})

const AddressSchema = new Schema({
    address: {type: String, default: null},
    // --- Considerable ---
    // city: {type: String, default: null},
    // district: {type: String, default: null},
    // ward: {type: String, default: null},
    // street: {type: String, default: null},
    // house_number: {type: String, default: null},
})

const UtilSchema = new Schema({
    images: [{type: String, default: null}],
})

const ConfirmSchema = new Schema({
    phone_number: {type: String, default: null},
    title_of_post: {type: String, default: null},
    room_description: {type: String, default: null},
})

const PostSchema = new Schema(
    {
        author: {type: mongoose.ObjectId},
        information: InfoSchema, 
        address: AddressSchema, 
        utilities: UtilSchema, 
        confirmation: ConfirmSchema,
        status: {type: Number, default: PostStatus.PENDING},
        soft_delete: {type: Boolean, default: false},
    },
    {
        timestamps: true,
    },
)

PostSchema.index({
    "address.address": "text",
    "title_of_post": "text",
    "room_description": "text",
    //phone_number: "text",

})
// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('post', PostSchema);