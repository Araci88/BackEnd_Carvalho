import { Router } from "express";
import ProductManager from "../Dao/FileSystem/productManager.js";
import ProductService from "../Dao/DB/products.service.js";
import { productModel } from "../Dao/DB/models/products.js";


const productManager = new ProductManager();
const productService = new ProductService();

const router = Router();

router.get("/", async (request, response) =>{
    try{
        //let prod = await productService.getAll();
        
        let {category, limit, page, sort} = request.query;
        let resultProducts = {};

        let prod = await productModel.paginate({}, {limit: (limit ? limit: 10), page: (page ? page: 1), sort: (sort ? sort: {price:1})})

        resultProducts = {
            status: "succcess",
            payload: prod.docs,
            totalPages: prod.totalPages,
            prevPage: prod.prevPage,
            nextPage: prod.nextPage,
            page: prod.page,
            hasPrevPage: prod.hasPrevPage,
            hasNextPage: prod.hasNextPage,
            prevLink: prod.hasPrevPage != false  ? `http://localhost:8080/api/products?limit=${(limit ? limit : 10)}&page=${parseInt((page ? page : 1))-1}&sort=${(sort ? sort: {price:1})}` : null ,
            nextLink: prod.hasNextPage != false  ? `http://localhost:8080/api/products?limit=${(limit ? limit : 10)}&page=${parseInt((page ? page : 1))+1}&sort=${(sort ? sort: {price:1})}` : null ,
        }
        response.send(resultProducts);
        //response.send(prod);
    } catch(error){
        console.log(error)
        response.status(500).send({error: "Error al consultar los productos", message: error});
    }
});

router.get("/:prodId", async (request, response) =>{
    try{
        const prodById = await productService.getById({_id: request.params.prodId});
        response.send(prodById);
        console.log(prodById);
    } catch(error){
        response.status(400).send({error: "Error al consultar por ID", message: error});
    }     
});

router.post("/", async (request, response) =>{
    try{
        let result = await productService.save(request.body);
        response.status(201).send(result);
    } catch(error){
        console.log("Error al guardar el producto. Error: " + error); 
        response.status(500).send({error: "Error al guardar el producto", message: error});
    }
});

router.put("/:prodId", async (request, response) =>{
    try{
        let {title, description, price, stock, category, status, thumbnail} = request.body;
        let product = await productService.updateOne({_id: request.params.prodId}, {title, description, price, stock, category, status, thumbnail});
        response.status(202).send(product);
    }catch(error){
        console.error("No se pudo actualizar el producto con moongose: " + error);
        response.status(500).send({error: "No se pudo actualizar el producto con moongose", message: error});
    }
});

router.delete("/:prodId", async(request, response) =>{
    try{
        const deleteOne = await productService.deleteOne({_id: request.params.prodId})
        return deleteOne;
    } catch(error){
        response.status(500).send({error: "Error al eliminar el producto", message: error});
    }
});

/*router.get("/", async (request, response) =>{
    try{
        const prod = await productManager.consultProduct();
        response.send(prod)
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
});*/

/*router.get('/:prodId', async (request, response) =>{
    const product = await productManager.getProducts();
    const productId = product.find(p => p.id == request.params.prodId);
    if(productId){
        response.send(JSON.stringify(productId));
    }else{
        response.status(400).send({error: "400", message: "El id ingresado es inválido o no existe"});
    }
});*/

/*router.post("/", async (request, response) =>{
    const newProd = request.body;

    try{
        await productManager.addProduct(newProd.title, newProd.description, newProd.price, newProd.thumbnail, newProd.stock, newProd.category, newProd.status, newProd.code)
        if(!newProd.title || !newProd.description || !newProd.price || !newProd.stock || !newProd.category){
            response.status(400).send({status: "Error", message: "Los campos son requeridos"})
        }
        response.status(201).send({message: "Producto incorporado con éxito!"});
    } catch(error){
        console.log("Error al guardar el producto. Error: " + error); 
        response.status(500).send({error: "Error al guardar el producto", message: error});
    }
});*/

/*router.put("/:prodId", async (request, response) =>{
    const prod = await productManager.consultProduct();

    let prodId = parseInt(request.params.prodId);
    const updateProd = request.body;
    const prodPosition = prod.findIndex((p => p.id === prodId))
    if (prodPosition < 0){
        return response.status(202).send({status: "info", error: "Producto no encontrado"});
    }

    updateProd.id = prod[prodPosition].id;
    prod[prodPosition] = updateProd;

    return response.status(200).send(productManager.writeJson(prod));
})*/

/*router.delete("/:prodId", async (request, response) =>{
    const prod = await productManager.consultProduct();

    const prodId = parseInt(request.params.prodId);

    const findProduct = prod.find(p => p.id === prodId);

    console.log(`id encontrado ${prodId}`)

    if (!findProduct){
        return response.status(202).send({status: "info", error: "Producto no encontrado"});
    }
    
    if(findProduct){
        const index = prod.indexOf(findProduct)
        prod.splice(index, 1);
        //console.log(prod);
        response.status(200).send(productManager.writeJson(prod))
        //response.status(200).send({status: "success", message: "producto eliminado"})
    }else{
        return response.status(500).send({status: "error", error: "El producto no se pudo eliminar"});
    }
})*/

export default router;
