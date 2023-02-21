const socket = io();

const submitForm = document.getElementById("submitForm");

submitForm.addEventListener("submit", (e) =>{
    e.preventDefault();
    if(e.key==="Enter"){
        socket.emit('messageFormProducts',submitForm.value);
        submitForm.value=""
    }
    submitForm.reset();
})

