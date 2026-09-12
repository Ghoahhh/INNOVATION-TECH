function loadProducts() {
    fetch("http://localhost:3000/products").then(r => r.json()).then(products => {
        const productsList = document.getElementById("productsList");
        productsList.innerHTML = "";

        products.forEach(p => {
            productsList.innerHTML += `
            <article class="card">
                <img src="${p.img}">
                <h3>${p.name}</h3>
                <p>${p.category}</p>
                <b>${p.price}</b>
                <p>Stock: ${p.stock}</p>
                <button onclick="editProduct('${p.art_id}')">Editar</button>
            </article>
            `
        });

        if(!products.length) return productsList.innerHTML = "<p>No hay productos disponibles.</p>";
    });
}

loadProducts();