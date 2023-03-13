import { productModel } from "./models/products.js";

export default class ProductService {
    getAll = async () => {
        let products = await productModel.find();
        return products.map(product => product.toObject());
    };

    save = async (product) =>{
        let result = await productModel.create(product);
        return result;
    };

    updateOne = async () =>{
        let updateProduct = await productModel.updateOne();
        return updateProduct;
    }

    getById = async (_id) =>{
        let getProdById = await productModel.findById({_id});
        return getProdById.toObject();
    }

    deleteOne = async () =>{
        let deleteOne = await productModel.deleteOne();

    }
};