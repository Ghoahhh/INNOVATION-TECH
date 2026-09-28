const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");

const app = express();

app.use(express.static(".")); /**Esto nos va a ayudar a decir que está carpeta contiene los archivos que el navegador puede abrir directamente*/
app.use(express.json()); /**Esto lo que nos va a permitir es que cuando le llegue un JSON a express este lo convierta a un objeto de js */
app.use(session({ /**Usamos la sesión de express para guardar la sesión de una persona en el servidor de manera segura*/
    secret: "innovation-tech",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 1000 * 60 * 64 * 24 * 7} /**Aquí ponemos que el tiempo máximo para espeirar la cookie de la sesión va a ser de 7 días*/
}));

const admin = (req, res, next) => { /**Esta función nos va a permitir relizar el requerimiento de un administrador, para que asi sea más seguro*/
    if(!req.session.document) return res.json({message: "No has iniciado sesión"}); /**Primero confirmamos si hay una sesión activa*/
    db.query("SELECT role FROM users WHERE document = ?", /**De la tabla de usuarios seleccinamos la columna role del usuario*/
        [req.session.document], 
        (err, data) => {
        if(err) return;
        if(!data.length || data[0].role != 1) return res.json({message: "No autorizado"}); /**Si tiene información o coincide con el rol necesario no deja que continue*/
        next(); /**Este es el que nos va a dejar continuar*/
    });
};

const logged = (req, res, next) => {
    if(!req.session.document) return res.json({message: "No has iniciado sesión"});
    next(); /**Si la sessión existe, continúa con la ruta que se va a ejecutar*/
}

app.get("/templates/admin.html", logged, admin, (req, res) => {
    res.sendFile(process.cwd + "/templates/admin.html");
})

const db = mysql.createConnection({ /**Crea la conexión a mysql */
    host: "localhost",
    user: "root",
    password: "",
    database: "innovation_tech" 
});

db.connect(err => { /**Realiza conexión a la base de datos*/
    if(err) console.log(err);
    else console.log("MySQL conectado.")
});

app.post("/login", (req, res) => { /**Este método nos va ayudar a hacer el incio de sesión*/
    const u = req.body;
    db.query(`SELECT * FROM users WHERE document = ? AND type_doc = ? AND password = ?`,
        [u.document, u.type_document, u.password],
        (err, data) => {
        if(err || data.length == 0) return res.json(null);
        req.session.document = data[0].document;
        req.session.save(() => {
            res.json(data[0]);
        });
        }
    );
});

app.get("/session", (req, res) => { /**Va a pedir si hay una sesión activa*/
   res.json(req.session.document || null);
});

app.post("/logout", (req, res) => { /**Va a realizar el cierre de sesión del usuario*/
    req.session.destroy();
    res.json();
});

app.post("/register", (req, res) => { /**Va a permitir a un cliente/usuario registrarse en nuetsra página*/
    const u = req.body;
    db.query(`INSERT INTO users (document, email, password, type_doc, name, last_name, phone, city, address, role) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.document,u.email,u.password,u.type_document,u.name,u.last_name,u.phone,u.city,u.address,2],
        err => {
            if(err?.code == "ER_DUP_ENTRY") { /**Esto lo que va a hacer es que va a leer el error del que tira la base de datos sobre la conexión diciendo que existe una cuenta ya existente*/
                return res.json({message: "La cuenta ya existe"})
            } else if(err) {
                console.log(err);
                return res.json({message: "No se pudo registrar el usuario"});
            }
            return res.json({message: "Te registraste con éxito"});
        }
    ); 
});

app.get("/users", logged, admin, (req, res) => { /**Va a pedir los usuarios*/
    db.query("SELECT document, email, type_doc, name, last_name, phone, city, address, role, status FROM users", (err, data) => {
        if(err) return;
        res.json(data);
    });
});

app.get("/user/:id", (req, res) => { /**Se va a filtrar un usuario unico, y nos va a dar la información del usuario*/
    db.query("SELECT document, email, type_doc, name, last_name, phone, city, address, role, status FROM users WHERE document = ?",
        [req.params.id], 
        (err, data) => {
        if(err) return;
        res.json(data[0]);
    });
});

app.post("/user", logged, admin, (req, res) => { /**Nos va a permitir actualizar el usuario*/
    const u = req.body;
    db.query(`UPDATE users SET email = ?, name = ?, last_name = ?, phone = ?, city = ?, role = ?, address = ? WHERE document = ?`,
        [u.email,u.name,u.last_name,u.phone,u.city,u.role,u.address,u.id],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json({message: "No se pudo actualizar el usuario"});
            }
            console.log(data);
            return res.json({message: "Usuario actualizado"});
        }
    ); 
});

app.get("/cart/:user", (req, res) => { /**Nos va a permitir encontrar el carrito de un usuario*/
    db.query("SELECT products FROM cart WHERE user_id = ?", 
        [req.params.user], 
    (err, data)  => {
        res.json(data.length ? JSON.parse(data[0].products) : []);
    }); 
});

app.post("/cart", logged, (req, res)  => { /**Nos va a permitir insertar o actualizar los productos sin duplicarlos que tiene un usuario*/
    const user = req.session.document;
    console.log(user, JSON.stringify(req.body.cart));
    db.query(`INSERT INTO cart VALUES (?, ?) ON DUPLICATE KEY UPDATE products = ?`,
        [user, JSON.stringify(req.body.cart), JSON.stringify(req.body.cart)],
        () => res.json({message: "Carrito actualizado"})) 
});

app.get("/roles", logged, admin, (req, res) => { /**Vamos a pedir la información de los roles*/
    db.query("SELECT * FROM role", (err, data) => {
        if(err) return;
        res.json(data);
    });
});

app.get("/role/:id", logged, admin, (req, res) => { /**Vamos a pedir la información de un rol*/
    db.query("SELECT * FROM role WHERE role_id = ?",
        [req.params.id], 
        (err, data) => {
        if(err) return;
        res.json(data[0]); /**Sacamos el primero registro del arreglo*/
    });
});

app.post("/role", logged, admin, (req, res) => { /**Nos va a permitir actualizar el usuario*/
    const u = req.body;
    db.query(`UPDATE role SET role_name = ?, role_description = ? WHERE role_id = ?`,
        [u.role_name,u.role_description,u.role_id],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json({message: "No se pudo actualizar el rol"});
            }
            console.log(data);
            return res.json({message: "rol actualizado"});
        }
    ); 
});

app.get("/orders", logged, (req, res) => { /**Vamos a pedir las ordenes que se han realizado de forma descendente*/
    db.query("SELECT * FROM orders ORDER BY date_order DESC", (err, data) => {/**Se va a encargar de organizar los pedidos de forma descendiente*/
        if(err) return;
        res.json(data);
    });
});

app.get("/orders-detail/:id", (req, res) => { /**Vamos a pedir la información de una orden con su id*/
    db.query("SELECT * FROM order_detail WHERE order_id = ?", 
        [req.params.id],
        (err, data) => {
        if(err) return res.json(null);
        res.json(data[0] || null);
    });
});

app.post("/orders", logged, admin, (req, res)  => { /**Nos va a permitir insertar, la información de la orden, eliminando la información del carrito*/
    const id = "ORD-" + Date.now();
    const {products, total, pay_method} = req.body;
    const user = req.session.document;

    db.query(`INSERT INTO orders (id, user_id, date_order) VALUES (?, ?, CURDATE())`,
        [id, user],
        err => {
            if(err) return res.json({message: "No se puede cerear el pedido"});
            db.query(`INSERT INTO order_detail (order_id, user_id, products, total, pay_method) VALUES (?, ?, ?, ?, ?)`, 
                [id, user, JSON.stringify(products), total, pay_method],
                err => {
                    if(err) return res.json({message: "No se pudo guardar los detalles del pedido"});
                    products.forEach(p => {
                        db.query(`Update article SET stock = stock - ? WHERE art_id = ? AND stock >= ?`,
                            [p.quantity, p.id, p.quantity]);
                    });
                    db.query("DELETE FROM cart WHERE user_id = ?", [user]);
                    res.json({id, message: "Compra realizada correctamente"});
                }
            );
        }
    )
});

app.get("/products", (req, res) => { /**Vamos a pedir todos los articulos*/
    db.query("SELECT * FROM article", (err, data) => {
        if(err) return;
        res.json(data);
    });
});

app.get("/product/:id", (req, res) => { /**Vamos a pedir la información de un articulo*/
    db.query("SELECT * FROM article WHERE art_id = ?", [
        req.params.id
    ], (err, data) => {
        res.json(data[0]);
    });
});

app.post("/product", logged, admin, (req, res) => { /**Se va a crear o modificar un articulo dependiendo si se envía un id o no*/
    const p = req.body;
    if(p.art_id) {
        db.query(`UPDATE article SET name = ?, price = ?, stock = ?, category = ?, img = ?, description = ? WHERE art_id = ?`,
            [p.name, p.price, p.stock, p.category, p.img, p.description, p.art_id],
            (err, data) => {
                if(err) {
                    console.log(err);
                    return res.json({message:"No se pudo editar el producto"});
                }
                res.json({message:"Producto actualizado"});
            }
        )
    } else {
        const id = "P" + Math.random().toString(36).substring(2, 7).toUpperCase();
        db.query(`INSERT INTO article (art_id, name, price, stock, category, img, description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id, p.name, p.price, p.stock, p.category, p.img, p.description],
            (err, data) => {
                if(err) {
                    console.log(err);
                    return res.json({message:"No se pudo agregar el producto"});
                }
                res.json({message:"Producto agregado"});
            }
        )
    }
});

app.delete("/:type/:id", logged, admin, (req, res) => { /**Nos va a permitir eliminar el un tipo de dato con su id*/
    const type = req.params.type;
    let query;
    
    switch (type) {
        case "product":
            query = "DELETE FROM article WHERE art_id = ?";
            break;
        case "user":
            query = "DELETE FROM users WHERE document = ?";
            break;
        case "order":
            query = "DELETE FROM orders WHERE order_id = ?";
            break;
        case "role":
            query = "DELETE FROM role WHERE role_id = ?";
            break;
    
        default:
            return res.json({message:"Tipo no válido"});
    }
    db.query(query,
        [req.params.id],
        (err, data) => {
            if(err) {
                console.log(err);
                return res.json({message:"No se puede eliminar el " + type});
            }
            res.json({message:"Eliminado correctamente"});
        }
    )
});

app.listen(3000, () => {
    console.log("Base de datos de Innovaition Tech iniciada.");
});
