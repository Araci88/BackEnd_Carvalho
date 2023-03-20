import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './util.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import ProductManager from './Dao/FileSystem/productManager.js';
import mongoose, { connect } from 'mongoose';
import { mongoDB_URI } from '../config.js';
import MessageService from './Dao/DB/chat.service.js';


const app = express();
const productManager = new ProductManager();
const messageService = new MessageService();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars')

app.use("/api/products", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/", viewsRouter);
app.use(express.static(__dirname+'/public'));

const SERVER_PORT = 8080;

const httpServer = app.listen(SERVER_PORT, () =>{
    console.log(`Servidor listo escuchando en el puerto: ${SERVER_PORT}`);
});

const connectMongoDB = async () =>{
    try {
        await mongoose.connect(mongoDB_URI)
        console.log("Conectado a MongoDB con Mongoose");
    } catch (error){
        console.error("No se pudo conectar a MongoDB" + error);
        process.exit();
    }
};

connectMongoDB();

const socketServer = new Server(httpServer);

socketServer.on("connection", socket => {
    console.log("Nuevo cliente conectado");

    socket.on('createProd', ({title, description, price, thumbnail, stock, category}) => {
        const createProd = productManager.addProduct(title, description, price, thumbnail, stock, category)
        socket.emit("formProduct", createProd);
    });

    let getMessages = async () =>{
        let message = await messageService.getMessages();
        socketServer.emit("getChat", message)
    }

    let saveMessages = async (data) =>{
        await messageService.saveMessages(data);
        getMessages();
    }

    socket.on("getChat", () =>{
        getMessages();
    });

    socket.on("saveMessages", data =>{
        saveMessages(data);
    })
});
