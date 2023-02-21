const socket = io();

const formProducts = document.getElementById("formProducts")
const submitForm = document.getElementById("submitForm");

formProducts.addEventListener("submit", (e) =>{
    e.preventDefault();
    if(e.key==="Enter"){
        socket.emit('messageFormProducts',formProducts.value);
        formProducts.value="";
    }
    formProducts.reset();
})

socket.on("formProducts", data =>{
    console.log(data)
    socketServer.emit(data)
    formProducts.innerHTML = data;
})

