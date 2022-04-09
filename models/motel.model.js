const mongoose = require('mongoose');
const { Schema } = mongoose;

const MotelSchema = new Schema(
    {
        name: { type: String },
        address: {
            Tinh: { type: String},
            Huyen: { type: String},
            Xa: { type: String},
        }, 
        rent: {type: Number, default: 1000},
    }
)

// Export a model
// Modal name = Collection name (in plural & lowercase form)
module.exports = mongoose.model('motel', MotelSchema)