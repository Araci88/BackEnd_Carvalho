class Products {
	constructor(title, description, price, thumbnail, stock){
		this.title = title;
		this.description = description;
		this.price = price; 
		this.thumbnail = thumbnail;
		this.stock = stock;
		this.code = Math.random().toString(30).substring(2);
		this.id = Products.getId();
	} 
	
	static getId = () => {
        if(this.id) {
            this.id++
        } else{
            this.id = 1
        }
        return this.id
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
		this.#fileSystem = require("fs");
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

	addProduct = async (title, description, price, thumbnail, stock, code, id) => {
		let newProduct = new Products (title, description, price, thumbnail, stock, code, id);
		console.log(newProduct);

		try{
			await this.prepareDirProducts();
            await this.consultProduct()

			if(this.products.some(prod => prod.code === newProduct.code)){
				console.error("El código ya existe")
			}else{
				this.products.push(newProduct);
				console.log("Lista actualizada de productos: ");
				console.log(this.products)
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
            //throw Error(`Error al consultar los productos ${error}`);
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

let productManager = new ProductManager();
console.log(productManager);
console.log(productManager.getProducts());
productManager.addProduct("Taza", "Taza de cerámica color negro", 1500, "Imagen no encontrada", 25);
console.log(productManager.getProducts());
productManager.addProduct("Termo", "Termo de acero inoxidable", 11500, "Imagen no encontrada", 30);
console.log(productManager.getProducts());
//productManager.getProductById(1);
//productManager.deleteProduct(2);
productManager.addProduct("Mate", "Mate de cerámica", 2000, "Imagen no encontrada", 20);
console.log(productManager.getProducts());
// productManager.updateProduct(1, {price: 2500});


