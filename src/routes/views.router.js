import express from "express";
import ProductManager from "../Dao/FileSystem/productManager.js";

const router = express.Router();
const productManager = new ProductManager();
const products = await productManager.getProducts();

router.get("/", (request, response) =>{
    response.render("index")
})

router.get("/home", (request, response) => {
    response.render("home", {products})
})

router.get("/realtimeproducts", (request, response) =>{
    response.render("realTimeProducts", {products})
})

router.get("/chat", (request, response) =>{
    response.render("chat", {});
})

export default router;