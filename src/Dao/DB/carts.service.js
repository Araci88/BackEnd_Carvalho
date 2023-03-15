import { cartModel } from "./models/carts.js";

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
        let getCartById = await cartModel.findById(_id);
        return getCartById.toObject();
    };

};