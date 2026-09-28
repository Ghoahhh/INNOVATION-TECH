
async function load(type) { /**Esta funció nos va a ayudar a recargar la información*/
    const form = document.getElementById("form");

    form.hidden = true;

    if(type == "home") return;

    await fetch("http://localhost:3000/" + type).then(r => r.json()).then(data => {
        switch (type) {
            case "users":
                const usersTable = document.getElementById("usersTable");
                usersTable.innerHTML = "";
                
                data.forEach(u => {
                    usersTable.innerHTML += `
                    <tr>
                        <td>${u.document}</td>
                        <td>${u.name}</td>
                        <td>${u.last_name}</td>
                        <td>${u.city}</td>
                        <td>${u.role}</td>
                        <td>
                            <button onclick="edit('user', '${u.document}')">Editar</button>
                            <button onclick="remove('user', '${u.document}')">Eliminar</button>
                        </td>
                    </tr>
                    `;
                });
                break;
            case "products":
                const productsList = document.getElementById("productsList");
                productsList.innerHTML = "";
        
                data.forEach(p => {
                    productsList.innerHTML += `
                    <article class="card">
                        <img src="${p.img}">
                        <h3>${p.name}</h3>
                        <p>${p.category}</p>
                        <b>${Number(p.price).toLocaleString("es-CO")}</b>
                        <p>Stock: ${p.stock}</p>
                        <button onclick="edit('product', '${p.art_id}')">Editar</button>
                        <button onclick="remove('product', '${p.art_id}')">Eliminar</button>
                    </article>
                    `
                });
                break;
            case "orders":
                const orders = document.getElementById("ordersTable");
                orders.innerHTML = "";
                data.forEach(o => {
                    ordersTable.innerHTML += `
                    <tr>
                        <td>${o.id}</td>
                        <td>${o.date_order}</td>
                        <td>${o.date_deliver || "No entregado"}</td>
                        <td>${o.user_id}</td>
                        <td>
                            <button onclick="orderInfo('${o.id}')">Info</button>
                        </td>
                    </tr>
                    `;
                });
                break;
            case "roles":
                const roles = document.getElementById("rolesTable");
                roles.innerHTML = "";
                data.forEach(r => {
                    roles.innerHTML += `
                    <tr>
                        <td>${r.role_id}</td>
                        <td>${r.role_name}</td>
                        <td>${r.role_description}</td>
                        <td>
                            <button onclick="edit('role', '${r.role_id}')">Editar</button>
                            <button onclick="remove('role', '${r.role_id}')">Eliminar</button>
                        </td>
                    </tr>
                    `;
                });
                break;
        }
    });
}

async function edit(type, id) {
    const form = document.getElementById("form");
    form.hidden = false;
    switch (type) {
        case "user":
            form.innerHTML = `
            <h2>Editar usuario</h2>
            <input type="hidden" name="id">
            <label>Nombre<input type="text" name="name" required></label>
            <label>Appellido<input type="text" name="last_name" required></label>
            <label>Correo<input type="email" name="email" required></label>
            <label>Teléfono<input type="text" name="phone" required></label>
            <label>Ciudad<select name="city" required><option default>...</option><option value="Bogota">Bogotá</option><option value="Medellin">Medellín</option><option value="Cali">Cali</option><option value="Barranquilla">Barranquilla</option><option value="Cartagena">Cartagena</option></select></label>
            <label>Dirección<input type="text" name="address" required></label>
            <label>Rol<select name="role"></select></label>
            <button type="submit">Guardar</button>
            `;
            await fetch("http://localhost:3000/roles").then(r => r.json()).then(roles => {
                if(!form.elements.role) return;
                form.elements.role.innerHTML = "";
                roles.forEach(role => {
                    form.elements.role.innerHTML += `
                    <option value="${role.role_id}">${role.role_name}</option>
                    `;
                })
            });
            if(id) {
                await fetch("http://localhost:3000/user/" + id).then(r => r.json()).then(user => {    
                    form.elements.id.value = user.document;
                    form.elements.name.value = user.name;
                    form.elements.last_name.value = user.last_name;
                    form.elements.email.value = user.email;
                    form.elements.phone.value = user.phone;
                    form.elements.city.value = user.city || "";
                    form.elements.address.value = user.address || "";
                    form.elements.role.value = user.role || "";
                });
            }
            break;
        case "product":
            form.innerHTML = `
                <h2>${id ? "Editar producto" : "Agregar producto"}</h2>
                <img id="formImg">
                <input type="hidden" name="art_id">
                <label>Nombre<input type="text" name="name" required></label>
                <label>Precio<input type="number" name="price" required></label>
                <label>Stock<input type="number" name="stock" required></label>
                <label>Categoría<input type="text" name="category" required></label>
                <label>Img<input type="text" name="img" required></label>
                <label>Descripción<textarea type="text" name="description"></textarea></label>
                <button type="submit">Guardar</button>
                `;
            if(id) {
                await fetch("http://localhost:3000/product/" + id).then(r => r.json()).then(p => {
            
                    form.elements.art_id.value = p.art_id;
                    form.elements.name.value = p.name;
                    form.elements.price.value = p.price;
                    form.elements.stock.value = p.stock;
                    form.elements.category.value = p.category;
                    form.elements.img.value = p.img;
                    form.elements.description.value = p.description;
        
                    document.getElementById("formImg").src = p.img
                });
            }
            break;
        case "role":
            form.innerHTML = `
                <h2>${id ? `Editar role - <span>${id}` : "Agregar rol"}</span></h2>
                <input type="hidden" name="role_id">
                <label>Nombre<input type="text" name="role_name" required></label>
                <label>Descripción<textarea type="text" name="role_description"></textarea></label>
                <button type="submit">Guardar</button>
                `;
            if(id) {
                await fetch("http://localhost:3000/role/" + id).then(r => r.json()).then(r => {
                    console.log(r);
                    form.elements.role_id.value = r.role_id;
                    form.elements.role_name.value = r.role_name;
                    form.elements.role_description.value = r.role_description || "";
                });
            }
            break;
        default:
            break;
    }
    form.onsubmit = async function(e) {
        e.preventDefault();
        await fetch("http://localhost:3000/" + type, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(Object.fromEntries(new FormData(form)))
        }).then(r => r.json()).then(data => {
            alert(data.message);
            form.reset();
            load(type + "s-.");
        });
    }
}
        
async function remove(type, id) {
    if(confirm("¿Seguro que quieres eliminarlo?")) {
        await fetch(`http://localhost:3000/${type}/${id}`, {
        method: "DELETE"
        }).then(r => r.json()).then(data => {
        alert(data.message);
        load(type);
        });
    }
}

async function orderInfo(id) {
    const order = await fetch(`http://localhost:3000/orders-detail/${id}`).then(r => r.json());
    if(!order) return alert("Este pedido no tiene información");

    const form = document.getElementById("form");

    form.hidden = false;

    form.innerHTML = `
    <h2>Información del pedido</h2>
    <label>Pedido<output>${order.order_id}</output></label>
    <label>Cliente<output>${order.user_id}</output></label>
    <label>Método de pago<output>${order.pay_method}</output></label>
    <label>Estado<output>${order.status}</output></label>
    <label>Total<output>${Number(order.total).toLocaleString("es-CO")}</output></label>

    <h3>Productos</h3>
    <div id="orderProducts"></div>
    `;

    const items = typeof order.products == "string" ? JSON.parse(order.products) : order.products; /**Lo que hace es que si el order.product viene como text, lo va a convertir en un arreglo de JS, pero si ya viene con el arreglo lo deja asi*/

    const box = document.getElementById("orderProducts");

    for(const item of items) { /**Nos va a permitir recorrer cada producto del pedido*/
        const product = await fetch("http://localhost:3000/product/" + item.id).then(r => r.json());

        box.innerHTML += `
        <article>
            <img src="${product.img}" alt="${product.name}" width="70">
            <div>
                <strong>${product.name}</strong>
                <p>${Number(product.price).toLocaleString("es-CO")}</p>
                <small>Cantiad: ${item.quantity}</small>
            </div>
        </article>`;
    }
}
        

load("users");
load("products");
