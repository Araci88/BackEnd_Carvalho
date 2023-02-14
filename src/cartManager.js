import * as fs from 'fs';

class Cart {
    constructor(products){
        this.products = new Array(products);
        this.id = Cart.id;
    }
}
class CartManager {

	#productDirPath;
    #productFilePath;
    #fileSystem;

	constructor(){
		this.carts = new Array();
		this.#cartDirPath = "files";
        this.#cartFilePath = this.#cartDirPath+"/Cart.json";
		this.#fileSystem = fs;
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
		return this.products;
	}

	addProduct = async (title, description, price, thumbnail, stock, category, status, code, id) => {
		let newProduct = new Products (title, description, price, thumbnail, stock, category, status, code, id);
		console.log(newProduct);

		try{
			await this.prepareDirProducts();
            await this.consultProduct();

			if(this.products.some(prod => prod.code === newProduct.code)){
				console.error("El código ya existe")
			}else{
				this.products.push(newProduct);
				//console.log("Lista actualizada de productos: ");
				//console.log(this.products)
				await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.products));
			}	
		}catch(error) {
			console.error(`Error al agregar producto: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
			throw Error(`Error al agregar producto: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
		}
    }

    consultProduct = async () =>{
        try{
            await this.prepareDirProducts();

            let productFile = await this.#fileSystem.promises.readFile(this.#productFilePath, "utf-8");
            
            console.info("Archivo JSON obtenido desde archivo: ");
            console.log(productFile);

            this.products = JSON.parse(productFile)
    
            console.log("Productos encontrados: ");
            console.log(this.products);

            return this.products;

        } catch (error){
            console.error("Error al consultar los productos");
            throw Error(`Error al consultar los productos, detalle del error ${error}`);
        }

    }

	getProductById = async (id) =>{
        try{
            await this.prepareDirProducts();
            await this.consultProduct();

            let productId = this.products.find((prod) => prod.id === id)
            if(productId){
                console.log("El producto está disponible ")
                console.log(productId)
            }else{
                console.log("El producto no se encuentra disponible")
            }
        }catch (error){
            console.log("Error al consultar ID")
            throw Error (`Error al consultar ID, el detalle del error ${error}`)
        }
	}

    deleteProduct = async (id) =>{
        try{
            await this.prepareDirProducts();
            await this.consultProduct();

            let deletProd = this.products.find((prod) => prod.id === id)
            if (deletProd){
                const index = this.products.indexOf(deletProd);
                this.products.splice(index, 1);
                console.log("se eliminó el producto")
                console.log(this.products)
                await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.products));
            }
        }catch{
            console.log("Error al eliminar el producto")
            throw Error (`Error al eliminar el producto, el detalle del error ${error}`)
        }
    }

    updateProduct = async (id, newProd) =>{
        await this.getProducts();
        const updateProd = this.products.map((prod) => {
            if(prod.id === id){
                return {...prod, ...newProd};
            }else{
                return prod;
            }
        });
        this.products = updateProd;
        await this.#fileSystem.promises.writeFile(this.#productFilePath, JSON.stringify(this.products));
        console.log(this.products);
    }

    deleteAllJson = async () =>{
        await this.prepareDirProducts();
        await this.consultProduct();
        await this.#fileSystem.promises.unlink(this.#productFilePath);
        console.log("Archivo borrado con éxito");
    }
}