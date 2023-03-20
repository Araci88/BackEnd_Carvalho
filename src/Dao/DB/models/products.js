import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model(productsCollection, productSchema);