import express from 'express';
import {productManager} from './BackEnd.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/products', async (request, response) =>{
    const prod = await productManager.getProducts();
    const limit = request.query.limit;

    if(!limit) {
        return response.send(JSON.stringify(prod));
    } 
    if(limit == "5"){
        let prodQuery = prod.slice(0,5);
        //console.log({prod:prodQuery});
        response.send({prod:prodQuery});
    }
});

app.get('/products/:prodId', async (request, response) =>{
    const product = await productManager.getProducts();
    const productId = product.find(p => p.id == request.params.prodId);
    if(productId){
        response.send(JSON.stringify(productId));
    }else{
        response.send({message: "producto no encontrado"});
    }
});

const SERVER_PORT = 8080;

app.listen(SERVER_PORT, () =>{
    console.log(`Servidor listo escuchando en el puerto: ${SERVER_PORT}`);
});