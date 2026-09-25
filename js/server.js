const express = require("express");
const session = require("express-session");
const mysql = require("mysql2");

const app = express();

app.use(express.static("."));
app.use(express.json());
app.use(session({
    secret: "innovation-tech",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax"}
}))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "innovation_tech" 
});

db.connect(err => {
    if(err) console.log(err);
    else console.log("MySQL conectado.")
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post("/login", (req, res) => {
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

app.get("/session", (req, res) => {
   res.json(req.session.document || null);
});

app.post("/logout", (req, res) => {
    req.session.destroy();
    res.json();
});

app.post("/register", (req, res) => {
    const u = req.body;
    db.query(`INSERT INTO users (document, email, password, type_doc, name, last_name, phone, city, address) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [u.document,u.email,u.password,u.type_document,u.name,u.last_name,u.phone,u.city,u.address],
        err => {
            if(err == "ER_DUP_ENTRY") {
                return res.json({message: "La cuenta ya existe"})
            } else if(err) {
                console.log(err);
                return res.json({message: "No se pudo registrar el usuario"});
            }
            return res.json({message: "Te registraste con éxito"});
        }
    ); 
});

app.get("/users", (req, res) => {
    db.query("SELECT * FROM users", (err, data) => {
        if(err) return;
        res.json(data);
    });
});

app.get("/users/:id", (req, res) => {
    db.query("SELECT * FROM users WHERE document = ?",
        [req.params.id], 
        (err, data) => {
        if(err) return;
        res.json(data[0]);
    });
});

app.post("/users", (req, res) => {
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

app.get("/roles", (req, res) => {
    db.query("SELECT role_id, role_name FROM role", (err, data) => {
        if(err) return;
        res.json(data);
    });
});

app.get("/products", (req, res) => {
    db.query("SELECT * FROM article", (err, data) => {
        if(err) return;
        res.json(data);
    });
});

app.get("/products/:id", (req, res) => {
    db.query("SELECT * FROM article WHERE art_id = ?", [
        req.params.id
    ], (err, data) => {
        res.json(data[0]);
    });
});

app.post("/products", (req, res) => {
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
})

app.delete("/:type/:id", (req, res) => {
    const type = req.params.type;
    let query;
    
    switch (type) {
        case "products":
            query = "DELETE FROM article WHERE art_id = ?";
            break;
        case "user":
            query = "DELETE FROM users WHERE document = ?";
            break;
        case "order":
            query = "DELETE FROM orders WHERE order_id = ?";
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
})


app.get("/cart/:user", (req, res) => {
    db.query("SELECT products FROM cart WHERE user_id = ?", [
        req.params.user
    ], 
    (err, data)  => {
        res.json(data.length ? JSON.parse(data[0].products) : []);
    }); 
});

app.post("/cart", (req, res)  => {
    console.log(req.body.user_id, JSON.stringify(req.body.cart), JSON.stringify(req.body.cart));
    db.query(`INSERT INTO cart VALUES (?, ?) ON DUPLICATE KEY UPDATE products = ?`,[
            req.body.user_id, JSON.stringify(req.body.cart), JSON.stringify(req.body.cart)],
        () => res.json({message: "Carrito actualizado"})) 
})


app.listen(3000, () => {
    console.log("Base de datos de Innovaition Tech iniciada.");
});
