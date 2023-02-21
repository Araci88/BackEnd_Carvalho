import * as fs from 'fs';

class CartManager {

	#cartDirPath;
    #cartFilePath;
    #fileSystem;

	constructor(){
		this.cart = new Array();
		this.#cartDirPath = "files";
        this.#cartFilePath = this.#cartDirPath+"/Cart.json";
		this.#fileSystem = fs;
        this.idCart = 1;
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
        let newCart = {
            products : []
        }
        console.log(newCart);

        try{
            await this.prepareDirCarts();
            await this.consultCarts();

            while (this.cart.some(cart => cart.idCart === this.idCart)){
                this.idCart++;
            } 

            newCart.idCart = this.idCart;
            this.cart.push(newCart);
            await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(this.cart));
        }catch(error) {
			console.error(`Error al agregar cart: ${JSON.stringify(newCart)}, detalle del error: ${error}`);
			throw Error(`Error al agregar cart: ${JSON.stringify(newCart)}, detalle del error: ${error}`);
		}
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

    getCartById = async (idCart) =>{
        await this.consultCarts();
        const cartId = this.cart.find(c => c.idCart == idCart);
        if(cartId){
            return cartId
        }else{
            console.error("El cart no existe")
        }
    }

    builtCart = async (cartId, prodId, quantity, pos) =>{
        await this.consultCarts()
        
        let cart = this.cart[pos]

        const productPosition = cart.products.findIndex(p => p.prodId == prodId)

        if(productPosition <0){
            let newProduct = {
                prodId: prodId,
                quantity: 1
            }
            this.cart[pos].products.push(newProduct)
        }else{
            //const lastQuantity = parseInt(cart.products[productPosition].quantity)
            this.cart[pos].products[productPosition].quantity = quantity++
        }

        await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(this.cart));
    }

    writeCart = async () =>{
        await this.#fileSystem.promises.writeFile(this.#cartFilePath, JSON.stringify(this.cart));
    }
}

export default CartManager;