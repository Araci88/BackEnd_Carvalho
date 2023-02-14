import * as fs from 'fs';

export class Products {
	constructor(title, description, price, thumbnail, stock, category){
		this.title = title;
		this.description = description;
		this.price = price; 
		this.thumbnail = thumbnail;
		this.stock = stock;
        this.category = category;
        this.status = true;
		this.code = Math.random().toString(30).substring(2);
		this.id = Products.getId();
	} 
	
    static getId = () => {
        if(this.id) {
            this.id++;
        } else{
            this.id = 1;
        }
        return this.id;
    }

};

class ProductManager {

	#productDirPath;
    #productFilePath;
    #fileSystem;

	constructor(){
		this.products = new Array();
		this.#productDirPath = "files";
        this.#productFilePath = this.#productDirPath+"/Products.json";
		this.#fileSystem = fs;
	}

    prepareDirProducts = async () => {
        await this.#fileSystem.promises.mkdir(this.#productDirPath, { recursive: true });

        if(!this.#fileSystem.existsSync(this.#productFilePath)) {
            await this.#fileSystem.promises.writeFile(this.#productFilePath, "[]");
        }
    }

	getProducts = async () => {
        await this.prepareDirProducts();
        await this.consultProduct();
		return this.products;
	}

	addProduct = async (title, description, price, thumbnail, stock, category, status, code) => {
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

/*
let productManager = new ProductManager();
console.log(productManager);
console.log(productManager.getProducts());
productManager.addProduct("Taza", "Taza de cerámica color negro", 1500, "Imagen no encontrada", 25, "Tazas");
productManager.addProduct("Termo", "Termo de acero inoxidable 1lt", 11500, "Imagen no encontrada", 30, "Termos");
productManager.addProduct("Mate", "Mate de cerámica", 2000, "Imagen no encontrada", 20, "Mates");
productManager.addProduct("Vaso", "Vaso de vidrio", 600, "Imagen no encontrada", 60, "Vasos");
productManager.addProduct("Vaso térmico", "Vaso térmico de acero inoxidable", 3000, "Imagen no encontrada", 15, "Vasos");
productManager.addProduct("Chopp", "Chopp de vidrio esmerilado", 1000, "Imagen no encontrada", 30, "Vasos");
productManager.addProduct("Botella", "Botella de vidrio 500ml", 2500, "Imagen no encontrada", 20, "Botellas");
productManager.addProduct("Kit matero", "Kit matero color negro", 5000, "Imagen no encontrada", 10, "Mate");
productManager.addProduct("Platos", "Set de platos de cerámica", 7000, "Imagen no encontrada", 80, "Vajilla");
productManager.addProduct("Jarra de vidrio", "Jarra de vidrio 1lt", 2000, "Imagen no encontrada", 20, "Vajilla");
console.log(productManager.getProducts());
*/

export default ProductManager;

