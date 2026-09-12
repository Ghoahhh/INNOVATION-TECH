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
        localStorage.setItem("user_id", data.document); //Va a almacenar en el localStorage la el documento del usuario
        localStorage.setItem("user_name", data.name);
        form.reset();
        Login.close(); //Va a cerrar el menú de iniciar sesión
        actualizarCuenta(); //Va a refrescar los datos del usuario para que aparezca en la página
    }).catch(err => { //Va a atrapar el error
        console.log(err); //Va a enviar el error a la consola
        alert(err + "Error al iniciar sesión"); //Va a enviar el error en la pagina
    });
}


async function register(form) {
    const user = Object.fromEntries(new FormData(form));

    if(user.password != user.confirm_password) return alert("Las contraseñas no conciden.");
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
        Register.close();
    }).catch(err => {
        console.log(err);
        alert(err + "Error al register");
    });
}

function actualizarCuenta() {
    const name = localStorage.getItem("user_name");
    if(name) {
        document.getElementById("accountName").textContent = name;
        document.getElementById("accountMenu").hidden = true;
        document.getElementById("userMenu").hidden = false;
    } else {
        document.getElementById("accountName").textContent = "Invitado";
        document.getElementById("accountMenu").hidden = false;
        document.getElementById("userMenu").hidden = true;
        require("./app.js").getCart();
    }
}

actualizarCuenta();