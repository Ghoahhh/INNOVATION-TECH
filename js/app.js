async function login(form) {
    const user = Object.fromEntries(new FormData(form));//Va a convertir un formulario tipo html a js

    fetch("http://localhost:3000/login", { //Va a realizar una petición al localhost
        method: "POST", //Va enviar con un método seguro la información
        headers:{
            "Content-Type": "application/json" //Va a decir que los datos que se envian son tipo JSON
        },
        body: JSON.stringify(user) //Va a convertir los datos en una cadena tipo JSON 
    }).then(r => r.json()).then(data => { //Va a convertir la respuesta del servidor
        if(!data) { //Va a decir que si no concide la información no permita iniciar sesión
            alert("Documento o contraseña incorrectos");
            return; //Si esto es verdad todo se detiene aqui
        }
        alert("Bienvenido " + data.name); //Va a enviar una alerta para darle la bienvenida al usuario
        form.reset();
        document.getElementById("Login").close(); //Va a cerrar el menú de iniciar sesión
        actualizarCuenta(); //Va a refrescar los datos del usuario para que aparezca en la página
    }).catch(err => { //Va a atrapar el error
        console.log(err); //Va a enviar el error a la consola
        alert(err + "Error al iniciar sesión"); //Va a enviar el error en la pagina
    });
}

async function register(form) {
    const user = Object.fromEntries(new FormData(form));

    if(user.password != user.confirm_password) return alert("Las contraseñas no coinciden.");
    delete user.confirm_password;

    fetch("http://localhost:3000/register", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    }).then(r => r.json()).then(data => {
        alert(data.message);
        form.reset();
        document.getElementById("Register").close();
    }).catch(err => {
        console.log(err);
        alert(err + "Error al register");
    });
}

async function actualizarCuenta() {
    const logged = await fetch("http://localhost:3000/session").then(r => r.json());
    console.log(logged);
    if(logged) {
        await fetch("http://localhost:3000/users/" + logged).then(r => r.json()).then(user => {
            document.getElementById("accountName").textContent = user.name;
            document.getElementById("accountMenu").hidden = true;
            document.getElementById("userMenu").hidden = false;
            if(adminButton = document.getElementById("adminButton")) {
                adminButton.hidden = user.role != 1;
            }
        });
    } else {
        document.getElementById("accountName").textContent = "Invitado";
        document.getElementById("accountMenu").hidden = false;
        document.getElementById("userMenu").hidden = true;
        if(adminButton = document.getElementById("adminButton")) {
            adminButton.hidden = true;
        }
    }
}

async function logout() {
    await fetch("http://localhost:3000/logout", {
        method: "POST"
    }).then(() =>  actualizarCuenta());
}

actualizarCuenta();