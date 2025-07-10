const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['processing', 'on the way', 'delivered', 'cancelled'],
        default: 'processing',
    },
    totalAmount: {

        type: Number,
        required: true,
    },
    beers: [ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Beer',
        required: true,
        }],
        quantity: {
            type: Number,
            required: true,
            min: 0,
        }
       
    });
const Order = mongoose.model("order", OrderSchema);
module.exports = Order;