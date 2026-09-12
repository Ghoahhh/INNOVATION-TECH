async function products() {
    await fetch("http://localhost:3000/products").then(r => r.json()).then(data => {
        const box = document.getElementById("products");
        const filters = document.getElementById("filters");
        data.forEach(p => {
            box.innerHTML += `
            <article class="card">
                <a href="./products-details.html?id=${p.art_id}">
                    <img src="${p.img}">
                    <h3>${p.name}</h3>
                    <p>$${p.price}</p>
                    <p>Stock: ${p.stock}</p>
                    </a>
                    <button type="button" onclick="editCart('${p.art_id}')">Agregar</button>
            </article>`;
        });
    });
}

async function getProduct(id) {
    return await fetch("http://localhost:3000/products/" + id).then(r => r.json()).then(p => {
        if(document.getElementById("productDatails") && id ==  new URLSearchParams(location.search).get("id")) { 
            document.getElementById("productDatails").innerHTML = `
            <img src="${p.img}">
            <div>
                <h2>${p.name}</h2>
                <p><${p.name}/p>
                <b>${p.price}</b>
                <p>Stock: ${p.stock}</p>
                <button type="button" onclick="editCart('${p.art_id}')">Agregar</button>
            </div>
            `;
        }
        return p;
    });
}

async function getCart() {
    await fetch("http://localhost:3000/cart/" + localStorage.getItem("user_id")).then(r => r.json()).then(data => { //Realiza la petición al localhost usando el id del usuario
        cartNum.textContent = data.reduce((total, p) => total+p.quantity, 0); //Va a sumar la cantidad de productos que ha escogido para mostrarlos al lado del carrito
        const box = document.getElementById("cartProducts"); //Va a pedir el id de html
        box.innerHTML = ""; //Va a dejar la infomación que este en este vacia
        let subtotal = 0; //Coloca el subtotal en 0
        data.forEach(c => { //Repite la información
            getProduct(c.id).then(p => { //Consigue el producto para luego dar una promesa
                subtotal += p.price * c.quantity; //Multiplica la cantidad y el precio del producto
                box.innerHTML += `
                <article class="card">
                    <img src="${p.img}" width="70">
                    <b>"${p.name}"<br>${p.price}</b>
                    <input type="number" min="0" value="${c.quantity}" onchange="editCart('${c.id}', this.valueAsNumber)">
                </article>`; //Va a realizar el producto en la parte del carrito
                const shipping = subtotal >= 200000 || subtotal == 0 ? 0 : 12000; //Si el total es igual o mayor a 200mil el total se va a convertir en 0
                document.getElementById("subtotal").textContent = subtotal;
                document.getElementById("shipping").textContent = shipping == 0 ? "Gratis" : shipping; //Si el precio del envio es 0 va a decir Gratis de lo contrario va a cobrar
                document.getElementById("total").textContent = subtotal + shipping; //Suma la cantidad total con el costo de envio
            });
        });
    }).catch(err => {
        console.log(err);
        alert(err + "Error al obtener el carrito")
    });
}

async function editCart(id, quantity) {
    const user_id = localStorage.getItem("user_id"); //Consigue el usuario que se almacena de forma local
    if(!user_id) return alert("No ha iniciado sesión."); //Revisa si se ha iniciado sesión, osea que no aparece
    await fetch(`http://localhost:3000/cart/${user_id}`).then(r => r.json()).then(cart => { //Realiza la petición al localhost usando el user, luego devuelve dos promesas
        let p = cart.find(p => p.id == id); //Encuenta la canrtidad de productos que tiene el usuario
        getProduct(id).then(product => { //Pida la función de getProduct para luego dar una promesa
            if(quantity === undefined) { //Si la cantidad no se encuenta definida entonces va a hacer igual a agregar una, en este caso el botón de agregar
                quantity = p ? p.quantity + 1 : 1; // Aca pregunta cuantos productos de este tiene pero luego le suma uno
                if(quantity > product.stock) return alert("Solo hay " + product.stock + " disponibles"); //Si la cantidad es mayor a la del stock no va a dejar seguir
            }

            if(quantity > product.stock) return alert("Solo hay " + product.stock + " disponibles");
            if(quantity == 0) { //Si la cantidad es igual a 0 sigue a la siguiente línea
                cart = cart.filter(p => p.id != id); //Filtra los productos que estan y luego los elimina del JSON
            } else if(p) { //De lo contrario
                p.quantity = quantity; //Mantiene la cantidad
            } else {
                cart.push({id, quantity}); //Coloca la cantidad en el carrito
            }
    
            return fetch("http://localhost:3000/cart", { //Realiza la conexión con el local
                method: "POST", //Va a enviar la información de una forma segura
                headers: {
                    "Content-Type": "application/json" //Va a decir que toda la información va a ser enviada en JSON
                },
                body: JSON.stringify({
                    user_id, cart
                }) //Va a convertir todos los datos en tipo JSON
            }).then(() => getCart()); //Devuelve una promesa, la cual va a actualizar el carrito
        });
    }).catch(err => {
        console.log(err);
        alert(err + "Error al editar el carrito")
    });
}

products();
getCart();
