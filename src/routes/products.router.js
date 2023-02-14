import { Router } from "express";
import ProductManager from "../productManager.js";

const productManager = new ProductManager();

const router = Router();

router.get("/", async (request, response) =>{
    try{
        const prod = await productManager.consultProduct();
        const limit = request.query.limit;
        if(!limit){
            return response.send(prod);
        }
        if(limit){
            let prodQuery = prod.slice(0,parseInt(limit));
            response.send({prod:prodQuery});
        }
        
    } catch(error){
        response.status(500).send({error: "Error al consultar los productos", message: error});
    }
});

router.get('/:prodId', async (request, response) =>{
    const product = await productManager.getProducts();
    const productId = product.find(p => p.id == request.params.prodId);
    if(productId){
        response.send(JSON.stringify(productId));
    }else{
        response.status(400).send({error: "400", message: "El id ingresado es inválido o no existe"});
    }
});

router.post("/", async (request, response) =>{
    const newProd = request.body;
    try{
        await productManager.addProduct(newProd.title, newProd.description, newProd.price, newProd.thumbnail, newProd.stock, newProd.category, newProd.status, newProd.code, newProd.id)
        response.status(201).send({message: "Producto incorporado con éxito! Con id: "+ newProd.id});
    } catch(error){
        console.log("Error al guardar el producto. Error: " + error); 
        response.status(500).send({error: "Error al guardar el producto", message: error});
    }
});

export default router;
