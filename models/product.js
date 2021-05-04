const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        // required: true,
    },
    description: {
        type: String,
        // required: true
    },
    image: {
        type: String,
        default: "https://media.istockphoto.com/videos/loading-circle-icon-on-white-background-animation-video-id1093418606?s=640x640"
    },
    images: [{
        type: String
    }],
    brand: {
        type: String,
        default: ''
    },
    price : {
        type: Number,
        default:0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
    countInStock: {
        type: Number,
        // required: true,
        min: 0,
        max: 1000
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
})

productSchema.method('toJSON', function(){
    const { __v, ...object } = this.toObject();
    const { _id:id, ...result } = object;
    return { ...result, id };
});


exports.Product = mongoose.model('Product', productSchema);