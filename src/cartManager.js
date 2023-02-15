import * as fs from 'fs';
import ProductManager from './productManager.js';

const productManager = new ProductManager();

class Cart{
    constructor(){
        this.products = new Array();
    }
}
class CartManager {

	#cartDirPath;
    #cartFilePath;
    #fileSystem;

	constructor(){
		this.cart = new Array();
		this.#cartDirPath = "files";
        this.#cartFilePath = this.#cartDirPath+"/Cart.json";
		this.#fileSystem = fs;
        this.id = 1;
	}

    prepareDirCarts = async () => {
        await this.#fileSystem.promises.mkdir(this.#cartDirPath, { recursive: true });

        if(!this.#fileSystem.existsSync(this.#cartFilePath)) {
            await this.#fileSystem.promises.writeFile(this.#cartFilePath, "[]");
        }
    }

	getCart = async () => {
        await this.prepareDirCarts();
        await this.consultCarts();
		return this.cart;
	}

    createCart = async () =>{
        let newCart = new Cart();
        console.log(newCart);

        try{
            await this.prepareDirCarts();
            await this.consultCarts();

            while (this.cart.some(cart => cart.id === this.id)){
                this.id++;
            } 

            newCart.id = this.id;
            this.cart.push(newCart);
            await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(this.cart));
        }catch(error) {
			console.error(`Error al agregar cart: ${JSON.stringify(newCart)}, detalle del error: ${error}`);
			throw Error(`Error al agregar cart: ${JSON.stringify(newCart)}, detalle del error: ${error}`);
		}
    }

    addToCart = async () =>{

    }
    
    consultCarts = async () =>{
        try{
            await this.prepareDirCarts();

            let cartFile = await this.#fileSystem.promises.readFile(this.#cartFilePath, "utf-8");
            
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(cartFile);

            this.cart = JSON.parse(cartFile)
    
            console.log("Carts encontrados: ");
            console.log(this.cart);

            return this.cart;

        } catch (error){
            console.error("Error al consultar los carts");
            throw Error(`Error al consultar los carts, detalle del error ${error}`);
        }

    }
}

export default CartManager;