const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit',e=>{
    e.preventDefault();
    const data = new FormData(registerForm);
    //console.log(data);
    const obj = {};

    data.forEach((value,key)=>obj[key]=value);
    //console.log("Objeto formado:");
    //console.log(obj);
    fetch('/api/sessions/register',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Server error');
        }
    }).then(data => {
        if (data.status === "success") {
            window.location.href = data.redirectUrl;
        } else {
            console.error('Error:', data.message);
        }
    }).catch(error => {
        console.error('Error:', error);
    });
});