const socket = io()

document.getElementById('resetForm').addEventListener('submit', async (e) => {
    e.preventDefault()
    const password1 = document.querySelector("#pwd").value
    const password2 = document.querySelector("#pwd2").value
    const email = document.getElementById("emailPlaceholder").textContent;
    if(password1 != password2)
    {
        socket.emit("notMatchPass");
    }
    else
    {
        socket.emit("validActualPass", {password1, password2, email});
    }
    
})
socket.on("warning", (data) => {
    Swal.fire({
        icon: 'warning',
        title: data,
        confirmButtonText: 'Aceptar', 
    })}).then((result) => {
        if (result.isConfirmed) {
            location.reload(); // Recarga la página cuando se hace clic en Aceptar
        }
    });


socket.on("samePass", (data) => {
    Swal.fire({
        icon: 'warning',
        title: data,
        confirmButtonText: 'Aceptar', 
    })}).then((result) => {
        if (result.isConfirmed) {
            location.reload(); // Recarga la página cuando se hace clic en Aceptar
        }
    });

socket.on("passChange", (data) => {
    Swal.fire({
        icon: 'success',
        title: data,
        confirmButtonText: 'Aceptar',
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = `/`;
        }
    });
});
socket.on("errorPassChange", (data) => {
    Swal.fire({
        icon: 'error',
        title: data,
        confirmButtonText: 'Aceptar',
    })}).then((result) => {
        if (result.isConfirmed) {
            location.reload(); // Recarga la página cuando se hace clic en Aceptar
        }
    });
