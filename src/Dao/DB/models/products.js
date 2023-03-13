import mongoose from "mongoose";

const productsCollection = 'products';

const stringNoUniqueRequired = {
    type: String,
    required: true
};

const numberNoUniqueRequired = {
    type: Number,
    required: true
};

const productSchema = new mongoose.Schema({
    title: stringNoUniqueRequired,
    description: stringNoUniqueRequired,
    price: numberNoUniqueRequired,
    stock: numberNoUniqueRequired,
    category: stringNoUniqueRequired,
    status: {
        type: Boolean,
        required: true
    },
    thumbnail: stringNoUniqueRequired
});

export const productModel = mongoose.model(productsCollection, productSchema);