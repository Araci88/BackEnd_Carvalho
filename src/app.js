import express from 'express';
import productsRouter from './routes/products.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/products", productsRouter);

const SERVER_PORT = 8080;

app.listen(SERVER_PORT, () =>{
    console.log(`Servidor listo escuchando en el puerto: ${SERVER_PORT}`);
});
