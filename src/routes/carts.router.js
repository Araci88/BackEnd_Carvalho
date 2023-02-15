import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.post("/", async (request, response) =>{
    const newCart = request.body;
    try{
        await cartManager.createCart(newCart)
        response.status(201).send({message: "Cart creado con éxito!"});
    } catch(error){
        console.log("Error al guardar el cart. Error: " + error); 
        response.status(500).send({error: "Error al guardar el cart", message: error});
    }
})

router.get("/:cartId", async (request, response) =>{
    const cart = await cartManager.getCart();
    const cartId = cart.find(c => c.id == request.params.cartId);
    if(cartId){
        response.send(JSON.stringify(cartId));
    }else{
        response.status(400).send({error: "400", message: "El id ingresado es inválido o no existe"});
    }
})

router.post("/:cartId/product/:prodId", async (request, response) =>{
    const product = await productManager.consultProduct();
    const cart = await cartManager.consultCarts();

    const prodId = product.find(p => p.id === request.params.prodId);
    const prodInCart = cart.find(c => c.id === request.params.cartId);

    if(prodId){
        response.send(cart)
    }else{
        response.status(500).send({error: "500", message: "No se pudo agregar el producto"})
    }

})

export default router;