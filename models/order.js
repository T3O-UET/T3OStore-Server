const { Product } = require('./product')
const mongoose = require('mongoose');

const orderProductSchema = mongoose.Schema({
    product: { type: mongoose.Types.ObjectId, ref: 'Product' },
    quality: { type: Number, default: 1 }
}, { _id: false });


const orderSchema = mongoose.Schema({
    products: [orderProductSchema],
    shippingAddress1: {
        type: String,
        required: true
    },
    shippingAddress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrdered: {
        type: Date,
        default: Date.now
    }
})

orderSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    const { _id: id, ...result } = object;
    return { ...result, id };
});

exports.Order = mongoose.model('Order', orderSchema);

