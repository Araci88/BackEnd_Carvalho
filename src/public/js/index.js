const socket = io();

const formProducts = document.getElementById("formProducts")
const submitForm = document.getElementById("submitForm");
const createProdButton = document.getElementById("createProd")

createProdButton.onclick = () =>{
    let title = document.getElementById("formTitle").value||"";
    let description = document.getElementById("formDescription").value||"";
    let price = document.getElementById("formPrice").value||"";
    let stock = document.getElementById("formStock").value||"";
    let thumbnail = document.getElementById("formImg").value||"";
    let category = document.getElementById("formCategory").value||"";
    let data = {title: title, description: description, price: price, thumbnail: thumbnail, stock: stock, category: category}
    socket.emit("createProd", data)
}