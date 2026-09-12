const express = require("express");
const mysql = require("mysql2");

const app = express();

app.use(express.static("."));
app.use(express.json());

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
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.post("/login", (req, res) => {
    const u = req.body;
    console.log(req.body);
    db.query(
        `SELECT * FROM users WHERE document = ? AND type_doc = ? AND password = ?`,
        [u.document, u.type_document, u.password],
        (err, data) => {
        if(err || data.length == 0) return res.json(null);
        res.json(data[0]);
        }
    )
});

app.post("/register", (req, res) => {
    const u = req.body;

    console.log(req.body);

    db.query(
        `INSERT INTO users (document, email, password, type_doc, name, last_name, phone, city, address) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,[
            u.document,u.email,u.password,u.type_document,u.name,u.last_name,u.phone,u.city,u.address
        ],
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

app.get("/products", (req, res) => {
    db.query("SELECT * FROM article", (err, data) => {
        if(err) return;
        console.log(data);
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
