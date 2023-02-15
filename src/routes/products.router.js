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
        await productManager.addProduct(newProd.title, newProd.description, newProd.price, newProd.thumbnail, newProd.stock, newProd.category, newProd.status, newProd.code)
        response.status(201).send({message: "Producto incorporado con éxito!"});
    } catch(error){
        console.log("Error al guardar el producto. Error: " + error); 
        response.status(500).send({error: "Error al guardar el producto", message: error});
    }
});

router.put("/:prodId", async (request, response) =>{
    const prod = await productManager.consultProduct();

    let prodId = parseInt(request.params.prodId);
    const updateProd = request.body;
    const prodPosition = prod.findIndex((p => p.id === prodId))
    if (prodPosition < 0){
        return response.status(202).send({status: "info", error: "Producto no encontrado"});
    }

    updateProd.id = prod[prodPosition].id;
    prod[prodPosition] = updateProd;

    console.log("Productos actuales: ");
    console.log(prod)

    return response.send({status: "Success", message: "Producto Actualizado.", data: prod[prodPosition]});
})

router.delete("/:prodId", async (request, response) =>{
    const prod = await productManager.consultProduct();
    let prodId = parseInt(request.params.prodId);
    const prodSize = prod.length;
    const prodPosition = prod.findIndex((p => p.id === prodId))
    if (prodPosition < 0){
        return response.status(202).send({status: "info", error: "Producto no encontrado"});
    }
    prod.splice(prodPosition, 1);
    if(prod.length === prodSize){
        return response.status(500).send({status: "error", error: "El producto no se pudo eliminar"});
    }
    return response.send({status: "Success", message: "Producto Eliminado"});
})

export default router;
