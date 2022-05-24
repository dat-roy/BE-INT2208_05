const {GenderOptions, PostStatus, RoomTypes} = require('../types/custom-types.js');
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const { Schema } = mongoose;

const InfoSchema = new Schema({
    //room_type: {type: String, default: ''},
    //capacity: {type: Number, default: 1},
    //gender: {type: String, default: GenderOptions.ALL}, 
    room_area: {type: Number, default: null},
    expenses: {
        rental_price: {type: Number}, 
        //deposit: {type: Number},
        //electricity_cost: {type: Number},
        //water_cost: {type: Number},
        //internet_cost: {type: Number},
    },
    //has_parking_space: {type: String}, 
    //parking_cost: {type: String},
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
    //utils: [{type: String, default: null}],
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

// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('post', PostSchema);