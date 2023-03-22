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
        let cart = await cartModel.findById(cartId)
        let index = cart.products.findIndex(p => p.prodId == p.prodId);

        cart.products.splice(index,1);

        const result = await cart.save();
        return result;
    };

    deleteAllProducts = async (cartId) => {
        let emptyCart = await cartModel.findById(cartId);
        
        emptyCart.products = [];

        await cartModel.updateOne({cartId}, emptyCart);
        
        const result = await emptyCart.save();
        return result;
        //return await cartModel.updateOne(cartId, emptyCart);
    };

    updateCart = async (cartId, products) => {
        const cart = await cartModel.findById(cartId);
        
        const updateProd = products.map(p => ({
            prodId: p.prodId,
            quantity: p.quantity || 1
        }));

        cart.products = updateProd;
        
        const result = await cart.save();
        return result;
    };

    updateQuantity = async (cartId, prodId, quantity) =>{
        const cart = await cartModel.findById(cartId);

        const isInCart = cart.products.find(p => p.prodId == p.prodId);

        isInCart.quantity = quantity;

        const result = await cart.save();

        return result;
    }
};