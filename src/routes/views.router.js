import express from "express";
import cookieParser from "cookie-parser";
import ProductManager from "../Dao/FileSystem/productManager.js";
import ProductService from "../Dao/DB/products.service.js";
import { productModel } from "../Dao/DB/models/products.js";
import { cartModel } from "../Dao/DB/models/carts.js";

const router = express.Router();
const productManager = new ProductManager();
const products = await productManager.getProducts();

const productService = new ProductService();

router.use(cookieParser());



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
        let products = await productModel.paginate({}, {page, limit:10, lean: true})

        let user, admin = true;
        
        if (request.session.user){
            user = request.session.user;
        }
        if (request.session.admin){
            admin = request.session.admin;
        }

        response.render("products", {
                products: products.docs, 
                currentPage: page, 
                totalPages: products.totalPages,
                hasPrevPage: products.hasPrevPage,
                hasNextPage: products.hasNextPage,
                prevPage: products.prevPage,
                nextPage: products.nextPage,
                user: user,
                admin: admin
        });

    }catch(error){
        console.log(error)
        response.status(500).send({error: "Error al consultar los productos", message: error});
    }
})

router.get("/cart/:cartId", async (request, response) =>{
    let cartId = request.params.cartId;

    let viewCart = cartModel.findById(cartId);

    response.render("cart/:cartId", viewCart);
})

router.get("/realtimeproducts", (request, response) =>{
    response.render("realTimeProducts", {products})
})

router.get("/chat", (request, response) =>{
    response.render("chat", {});
})

export default router;