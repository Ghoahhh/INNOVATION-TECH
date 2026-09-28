async function products() {
    await fetch("http://localhost:3000/products").then(r => r.json()).then(data => {
        const box = document.getElementById("products");
        const filters = document.getElementById("filters");
        if(!box) return;

        box.innerHTML = "";
        data.forEach(p => {
            box.innerHTML += `
            <article class="card">
                <a href="./products-details.html?id=${p.art_id}">
                    <img src="${p.img}">
                    <h3>${p.name}</h3>
                    <p>$${Number(p.price).toLocaleString("es-CO")}</p>
                    <p>Stock: ${p.stock}</p>
                    </a>
                    <button type="button" onclick="editCart('${p.art_id}')">Agregar</button>
            </article>`;
        });

        filters.addEventListener("submit", e => e.preventDefault()); /**Esto lo que hace es que no se haga el comportamiento normal del formulario*/

        filters.addEventListener("input", e => { /**Esto es que cada vez que el usuario cambie algo dentro de los filtros, ejecute este código*/
            const search = filters.search.value.toLowerCase(); /**Va a tomar el valor que se pone en el search y lo va a pasar a minusculas*/
            const type = filters.type.value;
            const stock = filters.stock.value;
            const price = filters.price.value;
            
            let result = [...data]; /**Va a contener todos los productos que llegaron desde el servidor*/

            
            if(search) { /**Nos va a permitir filtrar por el nombre del producto*/
                result = result.filter(p => p.name.toLowerCase().includes(search)); /**Aca va a convertir las letras en minusculas y va a se va a preguntar si el nombre contiene lo que escribió el usuario*/
            }

            if(type !== "all") { /**Si el usuario selecciona una categoría específica filtra*/
                result = result.filter(p => p.category == type); /**Va a realizar una compración va a decir que si la categoría del producto es igual a la categoría seleccionada*/
            }

            if(stock == "available") { /**Si el usuario selecciona el stock disponible*/
                result = result.filter(p => p.stock > 0); /**Solo se van a filtrar los productos con más de 0 unidades*/
            }
            if(stock == "low") { /**Si el usuario selecciona el stock menor a 5*/
                result = result.filter(p => p.stock > 0 && p.stock <= 5); /**Solo se van a filtrar los productos con menos o igual a 5 unidades*/
            }

            if(price == "low") { /**Si el usuario filtra por un precio*/
                result = result.filter(p => p.price <= 200000); /**Solo se van a filtrar los productos que tengan 200.000 o igual*/
            }
            if(price == "mid") {
                result = result.filter(p => p.price >= 200000 && p.price <= 500000); /**Solo se van a filtrar productos que sean mayores o iguales a 200.000 y menores e iguales a 500.000*/
            }
            if(price == "high") {
                result = result.filter(p => p.price > 500000); /**Solo se van a filtrar productos con un precio mayor a 500.000*/
            }

            if(result.length == 0) {
                return box.innerHTML = "<p>No se encontraron productos.</p>";
            }

            box.innerHTML = "";
            result.forEach(p => {
                box.innerHTML += `
                <article class="card">
                    <a href="./products-details.html?id=${p.art_id}">
                        <img src="${p.img}">
                        <h3>${p.name}</h3>
                        <p>$${Number(p.price).toLocaleString("es-CO")}</p>
                        <p>Stock: ${p.stock}</p>
                        </a>
                        <button type="button" onclick="editCart('${p.art_id}')">Agregar</button>
                </article>`;
            });
        });
    });
}

async function getProduct(id) { /**Esta función nos va a ayudar a obetener un producto en especifico*/
    return await fetch("http://localhost:3000/product/" + id).then(r => r.json()).then(p => {
        if(document.getElementById("productDatails") && id ==  new URLSearchParams(location.search).get("id")) { 
            document.getElementById("productDatails").innerHTML = `
            <div class="card">
            <img src="${p.img}">
            </div>
            <div class="card">
                <h1>${p.name}</h1>
                <small>${p.category}</small>
                <h2>$${Number(p.price).toLocaleString("es-CO")}</h2>
                <p>${p.stock > 0 ? "Disponible " + p.stock + " unidades" : "No disponible"}</p>
                <p>${p.description}</p>
                <button type="button" onclick="editCart('${p.art_id}')">Agregar</button>
            </div>
            `;
        }
        return p;
    });
}

async function getCart() {
    const logged = await fetch("http://localhost:3000/session").then(r => r.json());
    const box = document.getElementById("cartProducts"); //Va a pedir el id de html
    const cartNum = document.getElementById("cartNum"); //Va a pedir el id de html
    if(!logged) {
        if(cartNum) cartNum.textContent = 0;
        return {cart: [], totla: 0};
    }
    if(!box) return;
    return await fetch("http://localhost:3000/cart/" + logged).then(r => r.json()).then(async data => { //Realiza la petición al localhost usando el id del usuario
        if(cartNum) cartNum.textContent = data.reduce((total, p) => total+p.quantity, 0); //Va a sumar la cantidad de productos que ha escogido para mostrarlos al lado del carrito
        box.innerHTML = ""; //Va a dejar la infomación que este en vacia
        
        let cart = []; /**Vamos a guardar el carrito */
        let subtotal = 0; //Coloca el subtotal en 

        for(const c of data) {
            const p = await getProduct(c.id);
            if(!p || p.stock <= 0) continue;
            if(c.quantity > p.stock) c.quantity = p.stock;
            cart.push(c);
            subtotal += Number(p.price) * c.quantity; //Multiplica la cantidad y el precio del producto
            box.innerHTML += `
                <article class="card">
                    <img src="${p.img}" width="70">
                    <b>"${p.name}"<br>${Number(p.price).toLocaleString("es-CO")}</b>
                    <input type="number" min="0" value="${c.quantity}" onchange="editCart('${c.id}', this.valueAsNumber)">
                </article>`; //Va a realizar el producto en la parte del carrito
        }
        await fetch("http://localhost:3000/cart", { //Realiza la conexión con el local
            method: "POST", //Va a enviar la información de una forma segura
            headers: {
                "Content-Type": "application/json" //Va a decir que toda la información va a ser enviada en JSON
            },
            body: JSON.stringify({user: logged, cart}) //Va a convertir todos los datos en tipo JSON
        }).then(r => r.json());

        const shipping = subtotal >= 200000 || subtotal == 0 ? 0 : 12000; //Si el total es igual o mayor a 200mil el total se va a convertir en 0
        const total = subtotal + shipping;
        document.getElementById("subtotal").textContent = subtotal.toLocaleString("es-CO");
        document.getElementById("shipping").textContent = shipping == 0 ? "Gratis" : shipping.toLocaleString("es-CO"); //Si el precio del envio es 0 va a decir Gratis de lo contrario va a cobrar
        document.getElementById("total").textContent = total.toLocaleString("es-CO"); //Suma la cantidad total con el costo de envio
        
        const checkoutButton = document.getElementById("checkoutButton");
        if(checkoutButton) {
            checkoutButton.onclick = () => location.href = location.pathname.includes("/templates/") ? "checkout.html" : "./templates/checkout.html"; /**Primero va a mirar en que carpeta se encuentra antes de enviarlo*/
        }

        return {cart, total};
    }).catch(err => {
        console.log(err);
        alert(err + " Error al obtener el carrito")
    });
}

async function editCart(id, quantity) {
    const user = await fetch("http://localhost:3000/session").then(r => r.json()); //Consigue el usuario que se almacena
    if(!user) return alert("No ha iniciado sesión."); //Revisa si se ha iniciado sesión, osea que no aparece
    await fetch(`http://localhost:3000/cart/${user}`).then(r => r.json()).then(cart => { //Realiza la petición al localhost usando el user, luego devuelve dos promesas
        let p = cart.find(p => p.id == id); //Encuenta la canrtidad de productos que tiene el usuario
        getProduct(id).then(async product => { //Pida la función de getProduct para luego dar una promesa
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
    
            return await fetch("http://localhost:3000/cart", { //Realiza la conexión con el local
                method: "POST", //Va a enviar la información de una forma segura
                headers: {
                    "Content-Type": "application/json" //Va a decir que toda la información va a ser enviada en JSON
                },
                body: JSON.stringify({
                    user, cart
                }) //Va a convertir todos los datos en tipo JSON
            }).then(() => getCart()); //Devuelve una promesa, la cual va a actualizar el carrito
        });
    }).catch(err => {
        console.log(err);
        alert(err + "Error al editar el carrito")
    });
}

products();