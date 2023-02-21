import express from "express";
import ProductManager from "../productManager.js";

const router = express.Router();
const productManager = new ProductManager();
const products = await productManager.getProducts();

router.get("/", (request, response) =>{
    response.render("index")
})

router.get("/home", (request, response) => {
    response.render("home", {products})
})

export default router;