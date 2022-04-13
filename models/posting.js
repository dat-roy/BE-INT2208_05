const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({

    postingPerson: {
        type: String
    },
    content: {
        type: String
    },

    image: {
        type: String
    },

    price: {
        type: Number
    },
    status: {
        type: String
    },
    slug: {
        type: String
    }

},
    { timestamps: true }
)
const InfoSchema = new Schema({
    room_type: { type: String, default: '' },
    capacity: { type: Number, default: 0 },
    gender: { type: String },
    room_area: { type: Number, default: 0 },
    expenses: {
        rental_price: { type: String },
        deposit: { type: String },
        electricity_cost: { type: String },
        water_cost: { type: String },
        internet_cost: { type: String },
    },
    has_parking_space: { type: String },
    parking_cost: { type: String },
})

const AddressSchema = new Schema({
    city: { type: String, default: '' },
    district: { type: String, default: '' },
    ward: { type: String, default: '' },
    street: { type: String, default: '' },
    house_number: { type: String, default: '' },
})

const UtilSchema = new Schema({
    images: [{ type: String, default: '' }],
    utils: [{ type: String, default: '' }],
})

const ConfirmSchema = new Schema({
    phone_number: { type: String, default: '' },
    title_of_post: { type: String, default: '' },
    room_description: { type: String, default: '' },
    open_time: { type: String, default: '' },
    closing_time: { type: String, default: '' },
})

const PostSchema = new Schema(
    {
        author: { type: mongoose.ObjectId },
        information: InfoSchema,
        address: AddressSchema,
        utilities: UtilSchema,
        confirmation: ConfirmSchema,
        is_verified: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
)
const posting = mongoose.model('posting', postSchema);
module.exports = posting
