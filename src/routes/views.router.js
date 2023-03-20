import express from "express";
import ProductManager from "../Dao/FileSystem/productManager.js";
import ProductService from "../Dao/DB/products.service.js";
import { productModel } from "../Dao/DB/models/products.js";

const router = express.Router();
const productManager = new ProductManager();
const products = await productManager.getProducts();

const productService = new ProductService();

router.get("/", (request, response) =>{
    response.render("index")
})

router.get("/home", (request, response) => {
    try{
        response.render("home", {products})
    }catch(error){
        console.log(error)
        response.status(500).send({error: "Error al consultar los productos", message: error});
    }
})

router.get("/products", async (request, response) =>{
    try{
        let page = parseInt(request.query.page);
        if(!page) page = 1;
        let resultProd = await productModel.paginate({}, {page, limit:5, lean: true})
        resultProd.prevLink = resultProd.hasPrevPage?`http://localhost:8080/home?page=${resultProd.prevPage}`:'';
        resultProd.nextLink = resultProd.hasNextPage?`http://localhost:8080/home?page=${resultProd.nextPage}`:'';
        resultProd.isValid= !(page<=0||page>resultProd.totalPages);

        response.render("products", resultProd)
    }catch(error){
        console.log(error)
        response.status(500).send({error: "Error al consultar los productos", message: error});
    }
})

router.get("/realtimeproducts", (request, response) =>{
    response.render("realTimeProducts", {products})
})

router.get("/chat", (request, response) =>{
    response.render("chat", {});
})

export default router;