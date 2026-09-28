async function login(form) {
    const user = Object.fromEntries(new FormData(form));//Va a convertir un formulario tipo html a js

    await fetch("http://localhost:3000/login", { //Va a realizar una petición al localhost
        method: "POST", //Va enviar con un método seguro la información
        headers:{
            "Content-Type": "application/json" //Va a decir que los datos que se envian son tipo JSON
        },
        body: JSON.stringify(user) //Va a convertir los datos en una cadena tipo JSON 
    }).then(r => r.json()).then(data => { //Va a convertir la respuesta del servidor
        if(!data) { //Va a decir que si no concide la información no permita iniciar sesión
            alert("Documento o contraseña incorrectos"); //Manda una alerta a la página para notificar que el documento o contraseña estan incorrectos
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

    await fetch("http://localhost:3000/register", {
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

async function actualizarCuenta() { /**Esta función nos va a ayudar actualizar la cuenta a la hora de iniciar sesión o refrescar la página*/
    const logged = await fetch("http://localhost:3000/session").then(r => r.json()); /**Esta variable nos va ayudar a ver si hay un inicio de sesión activo o no*/
    const adminButton = document.getElementById("adminButton"); /**Nos va a traer el id del botón del panel administrativo*/
    if(logged) { /**Aquí colocamos una condicinal diciendo que si hay un logueo existente que siga a la siguiente lína */
        await fetch("http://localhost:3000/user/" + logged).then(r => r.json()).then(user => { /**Como ya sabemos que hay una sesión activa entonces vamos a pedir al servidor conseguir el user*/
            document.getElementById("accountName").textContent = user.name; /**En este obtenemos el id del menú desplegable para cambiar el nombre que va aparecer colocando el name del user*/
            document.getElementById("accountMenu").hidden = true; /**Aquí permitimos que el usuario puedda ver los nuevos botones para interactuar*/
            document.getElementById("userMenu").hidden = false; /**Aquí le quitamos los botones con los que interactuaba cuando todavía no habia iniciado sesión*/
            if(adminButton) { /**Aquí colocamos un condicinal*/
                adminButton.hidden = user.role != 1; /**Que se muestre si el usuario tiene el rol 1 que es el admin */
            }
        });
    } else { /**Si no hay un logueo entonces que devuelva lo siguiente */
        document.getElementById("accountName").textContent = "Invitado"; /**Aqui colocamos nuevamente el nombre en invitado porque no se ha iniciado sesión*/
        document.getElementById("accountMenu").hidden = false; /**Se esconden los botones con los que podia interactuar un usuario que ya ha iniciado sesión*/
        document.getElementById("userMenu").hidden = true; /**Aquí dejamos que se puedan visualiar el menu del usuario normal*/
        if(adminButton) { /**Aquí colocamos un condicinal*/
            adminButton.hidden = true; /**Que se esconda el botón de no haber una sesión abierta*/
        }
    }

    if(typeof getCart === "function") getCart(); /**Si en esta página existe getCart(), lo ejecúta, si no existe no lo ejecúta*/
}

async function logout() { /**Esta es la función que nos va a permitir hacer un logout del servidor*/
    await fetch("http://localhost:3000/logout", { /**Vamos a pedir al servidor con un método post que se actualice la información de la sesión del usuario */
        method: "POST"
    }).then(() =>  {actualizarCuenta();}); /**Aquí actualizamos la cuenta para quitar las opciones que tenía cuando habia iniciado sesión*/
}


async function dashboard() {
    const box = document.getElementById("dashboard"); /**Pedimos el id dashboard*/
    if(!box) return; /**Si no se encuentra la parte de dashboard no permita que siga a la siguiente línea*/

    const logged = await fetch("http://localhost:3000/session").then(r => r.json()); /**Miramos si hay una sessión activa al momento*/
    if(!logged) return location.href = "../index.html"; /**Si no hay una sessión activa en este momento lo devolvemos al home page*/

    const user = await fetch("http://localhost:3000/user/" + logged).then(r => r.json()); /**Pedimos el usuario usando el documento del incio de sesión*/

    box.innerHTML = `
    <div class="profile">
        <header>
            <h1>${user.name} ${user.last_name || ""}</h1>
            <p>${user.email}</p>
        </header>
        
        <div class="profile-info">
            <h2>Información personal</h2>
            <p><span>Documento</span> ${user.document}</p>
            <p><span>Tipo de documento</span> ${user.type_doc}</p>
            <p><span>Teléfono</span> ${user.phone || "Sin registrar"}</p>
            <p><span>Ciudad</span> ${user.city || "Sin registrar"}</p>
            <p><span>Dirección</span> ${user.address || "Sin registrar"}</p>
        </div>
    </div>
    `;
}

async function checkout() {
    const form = document.getElementById("checkout"); /**Pedimos el id checkout*/
    if(!form) return; /**Si no se encuentra el checkout no deja que avance*/
    
    const logged = await fetch("http://localhost:3000/session").then(r => r.json()); /**Miramos si hay una sessión activa al momento*/
    if(!logged) return location.href = "../index.html"; /**Si no hay una sessión activa en este momento lo devolvemos al home page*/

    const user = await fetch("http://localhost:3000/user/" + logged).then(r => r.json()); /**Pedimos el usuario usando el documento del incio de sesión*/
    form.name.value = user.name + " " + (user.last_name || "");
    form.phone.value = user.phone || "";
    form.city.value = user.city || "";
    form.address.value = user.address || "";
    
    form.onsubmit = async e => { /**Miramos cuando el formulario sea enviado*/
        e.preventDefault(); /**Este prevent nos va a permitir hacer que el formulario no se envie de manera normal, haciendo que lo podamos traabajar mejor con js*/

        const purchase = await getCart();
        if(!purchase.cart.length) return alert("Tu carrito está vacio"); /**Miramos si en el carrito hay products, sino no hay productos entonces devolvemos*/

        const data = Object.fromEntries(new FormData(form)); /**Convertimos el formulario a un tipo en el que lo pueda leer js */

        const order = await fetch("http://localhost:3000/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({products: purchase.cart, total: purchase.total, pay_method: data.pay_method})
        }).then(r => r.json());

        if(order.id) {
            alert("Compra realizada correctamente con el id: " + order.id);
            document.querySelector(".checkout").innerHTML = `
            <section class="card">
                <h1>Compra realizada con éxito</h1>
                <p>Gracias por tu compra.</p>
                <p>El ID de tu pedido es:</p>
                <strong>${order.id}</strong>
                <button><a href="dashboard.html">Ver mis pedidos</a></button>
                <button><a href="../index.html">Volver a la tienda</a></button>
            </section>
            `;
        } else {
            alert(order.message);
        }
    }
}

actualizarCuenta();
dashboard();
checkout();