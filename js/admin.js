async function load(type) {
    const form = document.getElementById("form");
    if(type == undefined) {
        form.hidden = true;
        return;
    }

    form.hidden = false;
    edit(type);
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
                            <button onclick="edit('users', '${u.document}')">Editar</button>
                            <button onclick="remove('users', '${u.document}')">Eliminar</button>
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
                        <b>${p.price}</b>
                        <p>Stock: ${p.stock}</p>
                        <button onclick="edit('products', '${p.art_id}')">Editar</button>
                        <button onclick="remove('products', '${p.art_id}')">Eliminar</button>
                    </article>
                    `
                });
                break;
            case "orders":
                const orders = document.getElementById("orderList");
                orders.innerHTML = "";
                data.forEach(o => {
                    usersTable.innerHTML += `
                    <tr>
                        <td>${u.document}</td>
                        <td>${u.name}</td>
                        <td>${u.last_name}</td>
                        <td>${u.city}</td>
                        <td>${u.role}</td>
                        <td><button type="button" onclick="edit('users', '${u.document}')">Editar</button>
                        <button type="button" onclick="remove('users', '${u.document}')">Eliminar</button></td>
                    </tr>
                    `;
                });
                break;
        }
    });
}

async function edit(type, id) {
    const form = document.getElementById("form");
    switch (type) {
        case "users":
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
                await fetch("http://localhost:3000/users/" + id).then(r => r.json()).then(user => {    
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
        case "products":
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
                await fetch("http://localhost:3000/products/" + id).then(r => r.json()).then(p => {
            
                    form.elements.art_id.value = p.art_id;
                    form.elements.name.value = p.name;
                    form.elements.price.value = p.price;
                    form.elements.stock.value = p.stock;
                    form.elements.category.value = p.category;
                    form.elements.img.value = p.img;
                    form.elements.description.value = p.description;
        
                    document.getElementById("productImg").src = p.img
                });
            }
            break;
        case "orders":
            form.innerHTML = `
                <h2>Editar producto</h2>
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
                await fetch("http://localhost:3000/products/" + id).then(r => r.json()).then(p => {
            
                    form.elements.art_id.value = p.art_id;
                    form.elements.name.value = p.name;
                    form.elements.price.value = p.price;
                    form.elements.stock.value = p.stock;
                    form.elements.category.value = p.category;
                    form.elements.img.value = p.img;
                    form.elements.description.value = p.description;
        
                    document.getElementById("productImg").src = p.img
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
            load(type);
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
        

load("users");
load("products");