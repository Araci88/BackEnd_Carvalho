const socket = io();

const formProducts = document.getElementById("formProducts")
const submitForm = document.getElementById("submitForm");
const createProdButton = document.getElementById("createProd")


socket.on("formProducts", data => {
    document.getElementById("message").innerHTML = "Producto creado correctamente!"
})

createProdButton.onclick = () =>{
    let data = addProduct();
    socket.emit("createProd", data)
}

const addProduct = () =>{
    const title = document.getElementById("formTitle").value;
    const description = document.getElementById("formDescription").value;
    const price = document.getElementById("formPrice").value;
    const stock = document.getElementById("formStock").value;
    const img = document.getElementById("formImg").value;
    const category = document.getElementById("formCategory").value;
    return {title,description,price,stock,category,img}
}