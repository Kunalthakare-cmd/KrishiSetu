const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    basePrice: {
        type: Number,
        required: true
    },
    description: String,
    images: [{
        type: String
    }],
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    status: {
        type: String,
        enum: ['available', 'in_auction', 'sold'],
        default: 'available'
    },
    harvestDate: Date,
    quality: {
        type: String,
        enum: ['A', 'B', 'C']
    }
}, {
    timestamps: true
});

productSchema.index({ location: '2dsphere' });

const Product = mongoose.model('Product', productSchema);
module.exports = Product; 