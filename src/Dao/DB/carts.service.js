import { cartModel } from "./models/carts.js";
import ProductService from "./products.service.js";

const productService = new ProductService();

export default class CartService{

    getAll = async () =>{
        let carts = await cartModel.find();
        return carts.map(carts => carts.toObject());
    };

    save = async (cart) =>{
        let result = await cartModel.create(cart);
        return result;
    };

    getById = async (_id) =>{
        let getCartById = await cartModel.findById(_id).populate("products.product");
        return getCartById.toObject();
    };

    addProduct = async (cartId, prodId) =>{
        let product = await productService.getById(prodId)
        let cart = await cartModel.findById(cartId).populate("products.product");

        if(cart){
            cart.products.push({product, quantity: 1})
            const result = await cart.save();
            return result;
        }
    };

    deleteProduct = async (cartId, prodId) => {
        let result = await cartModel.findByIdAndUpdate(cartId, prodId)
        return result;
    };

    deleteAllProducts = async (cartId) => {
        let deleteAllProd = await cartModel.updateOne({_id: cartId}, {products: {products: []}});
        return deleteAllProd;
    };
};