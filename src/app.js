import express from 'express';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import __dirname from './util.js';
import handlebars from 'express-handlebars';
import {Server} from 'socket.io';
import ProductManager from './Dao/FileSystem/productManager.js';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
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
app.use("/users", usersViewRouter);
app.use("/api/sessions", sessionsRouter);
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());

app.use(session({
    store: MongoStore.create({
        mongoUrl: mongoDB_URI,
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 30
    }),
    secret: "r3m3sS3cr3t",
    resave: false,
    saveUninitialized: true
}))

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

    let messages = [];

    let uploadMessages = async (newMessage) =>{
        let uploadMessage = await messageService.saveMessages(newMessage);
        return {
            success: true,
            message: `Message added`
        };
    }

    socket.on("message", data =>{
        messages.push(data),
        socketServer.emit("messageLogs", messages)
        uploadMessages(messages);
    });

    socket.on("userConnected", data => {
        console.log("User connected: " + data.user);
        socket.broadcast.emit("userConnected", data.user);
    });
});
