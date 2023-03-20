import { Router } from "express";
import CartManager from "../Dao/FileSystem/cartManager.js";
import ProductManager from "../Dao/FileSystem/productManager.js";
import CartService from "../Dao/DB/carts.service.js";
import ProductService from "../Dao/DB/products.service.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();
const cartService = new CartService();
const productService = new ProductService();

router.post("/", async (request, response) =>{
    try{
        let result = await cartService.save(request.body);
        response.status(201).send(result);
    } catch(error){
        console.log("Error al guardar el carrito. Error: " + error); 
        response.status(500).send({error: "Error al guardar el carrito", message: error});
    }
});

router.get("/:cartId", async (request, response) =>{
    try{
        const cartById = await cartService.getById({_id: request.params.cartId});
        response.send(cartById);
        console.log(cartById);
    } catch(error){
        response.status(400).send({error: "Error al consultar por ID", message: error});
    }  
})

router.post("/:cartId/product/:prodId", async (request, response) =>{
    try{
        const cartId = request.params.cartId;
        const prodId = request.params.prodId;

        let cartUpdate = await cartService.addProduct(cartId, prodId);
        console.log(cartUpdate)
        response.status(200).send(cartUpdate);

    }catch(error){
        console.log(error)
        response.status(500).send({error: "Error al agregar al carrito", message: error})
    }
});

router.delete("/:cartId/product/:prodId", async (request, response) =>{
    try{
        const cartId = request.params.cartId;
        const prodId = request.params.prodId;

        let deleteProd = await cartService.deleteProduct({_id: cartId}, {$pull: {products: {product: prodId}}}, {new: true})
        response.status(200).send(deleteProd);
    }catch(error){
        console.log(error);
        response.status(500).send({error: "No se pudo eliminar el producto", message: error})
    }
});

router.delete("/:cartId", async (request, response) =>{
    try{
        const cartId = request.params.cartId;

        const deleteAllProducts = await cartService.deleteAllProducts({_id: cartId}, {products: {product: []}})
        response.status(200).send(deleteAllProducts);
    }catch(error){
        console.log(error);
        response.status(500).send({error: "Error al eliminar los productos", message: error});
    }
});


/*router.post("/", async (request, response) =>{
    const newCart = request.body;
    try{
        //if(!newCart.products)
        await cartManager.createCart(newCart)
        response.status(201).send({message: "Cart creado con éxito!"});
    } catch(error){
        console.log("Error al guardar el cart. Error: " + error); 
        response.status(500).send({error: "Error al guardar el cart", message: error});
    }
})*/

/*router.get("/:cartId", async (request, response) =>{
    const cart = await cartManager.getCart();
    const cartId = cart.find(c => c.idCart == request.params.cartId);
    if(cartId){
        response.send(JSON.stringify(cartId));
    }else{
        response.status(400).send({error: "400", message: "El id ingresado es inválido o no existe"});
    }
})

router.post("/:cartId/product/:prodId", async (request, response) =>{

    const prodId = parseInt(request.params.prodId);
    const cartId = parseInt(request.params.cartId);

    const prod = await productManager.getProducts();
    const cart = await cartManager.consultCarts();

    const productPosition = prod.findIndex(p => p.id == prodId)
    const cartPosition = cart.findIndex(c => c.idCart == cartId)

    if(cartPosition < 0){
        return response.status(400).send({status: "info", message: "Cart no encontrado"})
    }

    if(productPosition < 0){
        return response.status(400).send({status: "info", message: "Product no encontrado"})
    }

    await cartManager.builtCart()
    return response.send({status: "Success", message: "Carrito Actualizado.", data: cart});
})*/

export default router;