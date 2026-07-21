const API = "https://localhost:3000";

async function login(user, password) { /*Esta funcion es la encargada de esperar y ingresar al perfil */
    const r = await fetch(API + "/login", { /*Estya va a hacer un declaración que espera al servidor para recoger los datos y mandarlos */
        method: "POST",
        headers:{
            "content-Type": "application/json"
        },
        body: JSON.stringify({
            user,
            password
        })
    });

    const user = await r.json();
    if(!user){
        return alert("Documento o contraseña incorrectos");
    }

    localStorage.setItem("user", user.id);
    localStorage.setItem("user", user.id);
}

async function register(user, name, email, password) {
    const r = await fetch(API + "/register", {
        method: "POST",
        headers:{
            "content-Type": "application/json"
        },
        body: JSON.stringify({
            userId,
            password
        })
    });

    const user = await r.json();
    if(!user){
        return alert("Documento o contraseña incorrectos");
    }
}