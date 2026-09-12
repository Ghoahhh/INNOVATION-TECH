CREATE DATABASE IF NOT EXISTS innovation_tech;
USE innovation_tech;

CREATE TABLE article (
  art_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  stock INT NOT NULL,
  category VARCHAR(50) NOT NULL,
  img VARCHAR(255) NOT NULL,
  description VARCHAR(255) DEFAULT NULL
);

CREATE TABLE orders (
  id VARCHAR(50) PRIMARY KEY,
  date_order DATE NOT NULL,
  date_deliver DATE DEFAULT NULL,
  user_id INT NOT NULL
);

CREATE TABLE order_detail (
  order_id VARCHAR(50) PRIMARY KEY, 
  user_id INT NOT NULL,
  products JSON NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  pay_method VARCHAR(255) NOT NULL,
  status ENUM("pendiente","enviado","entregado") DEFAULT 'pendiente',
  date_order TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
  user_id INT PRIMARY KEY,
  products JSON NOT NULL
);

CREATE TABLE role (
  role_id INT PRIMARY KEY,
  role_name VARCHAR(255) NOT NULL,
  role_description VARCHAR(255) DEFAULT NULL
);

CREATE TABLE user_status (
  status_id TINYINT PRIMARY KEY,
  status_name VARCHAR(255) NOT NULL,
  status_description VARCHAR(255) DEFAULT NULL
);

CREATE TABLE users (
  document INT PRIMARY KEY,
  email VARCHAR(256) NOT NULL,
  password VARCHAR(256) NOT NULL,
  type_doc ENUM("cc","ce","nit","passport","ppt") NOT NULL,
  name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) DEFAULT NULL,
  phone VARCHAR(15) DEFAULT NULL,
  city ENUM("Bogota","Medellin","Cali","Barranquilla","Cartagena") DEFAULT NULL,
  address VARCHAR(255) DEFAULT NULL,
  role INT DEFAULT NULL,
  status TINYINT NOT NULL DEFAULT 1,
  FOREIGN KEY (role) REFERENCES role(role_id),
  FOREIGN KEY (status) REFERENCES user_status(status_id)
);

ALTER TABLE orders ADD FOREIGN KEY (user_id) REFERENCES users(document);
ALTER TABLE order_detail ADD FOREIGN KEY (user_id) REFERENCES users(document);
ALTER TABLE cart ADD FOREIGN KEY (user_id) REFERENCES users(document);

INSERT INTO user_status (status_id, status_name, status_description)
VALUES
(1, 'Activo', 'El usuario puede ingresar al sistema'),
(2, 'Inactivo', 'El usuario no puede ingresar al sistema');


INSERT INTO article (art_id, name, price, stock, category, img, description) 
VALUES 
('P001', 'Lenovo V14', '150000', '10', 'Computador', '../img/products/computador.jpg', 'Computador de alto rendimiento.'),
('P002', 'iPhone 17pro max', '180000', '10', 'Celular', '../img/products/celular.jpg', 'Celular de alto rendimiento.'),
('P003', 'Xiaomi Buds', '140000', '10', 'Audifonos', '../img/products/audifonos.jpg', 'Audifonos de buen sonido.'),
('P004', 'iPad', '170000', '10', 'Tablet', '../img/products/ipad.jpg', 'Tablet para trabajo.');

INSERT INTO users (document, email, password, type_doc, name, last_name, phone, city, address, role, status) 
VALUES
(1234055, 'arepueza@colegiodulcemaria.edu.co', 'ansu123', 'ppt', 'anllerlyht', 'repueza', '301564657', 'Bogota', 'calle127b c bis#128 a', NULL, 1),
(1011108574, 'dnaranjo96@colegiodulcemarua.edu.co', 'danna123', 'cc', 'danna', 'naranjo', '3157949373', 'Bogota', 'conjunto residencial almenara', NULL, 1),
(1013271129, 'monterrozaxd@gmail.com', 'cuphead', 'cc', 'Juan Diego', 'Monterroza Ruiz', '3043502234', 'Bogota', 'camino verde', NULL, 1),
(1013271258, 'duartejhonesteban21@gmail.com', '12345678', 'cc', 'Jhon Esteban', 'Duarte Feria', '3237688016', 'Bogota', 'Edificio Yaiti', NULL, 1),
(1013695035, 'ashleyvega251010@gmail.com', '1Manzanagrande!', 'cc', 'Ashley ', 'Vega', '3197706463', 'Bogota', 'dimonti 1', NULL, 1),
(1014876898, 'dyanquen1@colegiodulcemaria.edu.co', '1Manzanagrande', 'cc', 'daniel esteban', 'yanquen lopez', '3197552290', 'Bogota', 'cra 145 # 145 A 41', NULL, 1),
(1019069954, 'riusakiym1@gmail.com', 'valriu_12', 'cc', 'valerie', 'alarcon gongora', '3153295150', 'Bogota', 'calle 131a#154-41', NULL, 1),
(1021635609, 'jr671706@gmail.com', '123456', 'cc', 'juan david', 'robles ochoa', '3244537405', 'Bogota', 'cll132 bis#153-56', NULL, 1),
(1025066385, 'matiaszambranoamado@gmail.com', '1234', 'cc', 'Matias Zambrano', 'Zambrano', '3188184412', 'Bogota', 'cr127c3139-45', NULL, 1),
(1028492448, 'smacana24@gmail.com', '1028492448*', 'cc', 'salome', 'macana', '3208706819', 'Bogota', 'calle 143 b 141c09', NULL, 1),
(1031819676, 'solerclaudia02@gmail.com', 'Csoler20091**', 'cc', 'Claudia Alejandra', 'Soler Sandoval', '3142572382', 'Bogota', 'diagonal 146# 128-70', NULL, 1),
(1031823879, 'ovamarianin@gmail.com', 'gisel123++', 'cc', 'Gisel Mariana', 'Ovalle ', '3161842425', 'Bogota', 'cra 131c-10', NULL, 1),
(1031826293, 'andrespabon751@gmail.com', '123456789', 'cc', 'Andres Stiven ', 'Pabon Campos', '3107684302', 'Bogota', 'cra150b#142c-27', NULL, 1),
(1032942930, 'alejandramorac1310@gmail.com', 'WINNIEPOOH1304', 'cc', 'María Alejandra', 'Mora Cubillos', '3138566034', 'Bogota', 'Calle 149 A #117-62', NULL, 1),
(1033108998, 'saranny04@gmail.com', 'saranyjaiiin', 'cc', 'Saray Daniela', 'Alba Mendoza', '3150383567', 'Bogota', 'calle131a#154-41', NULL, 1),
(1111551717, 'josehca27@gmail.com', '1111551717', 'cc', 'Jose Haider ', 'Cuero Alegria', '3133738622', 'Bogota', 'carrera 111A #145-60', NULL, 1),
(1117023695, 'evelynsofiacarvajal@gmail.com', '1117023695', 'cc', 'Evelyn Sofia', 'Carvajal Roa', '3219714824', 'Bogota', 'carrera 138A #143 - 75', NULL, 1),
(1121708132, 'samaya153@colegiodulcemaria.edu.co', '12345678', 'cc', 'salome', 'amaya', '3157668343', 'Bogota', 'calle 144c#141a-82', NULL, 1),
(1127591220, 'jguevaranocua@gmail.com', '67676769', 'cc', 'Juan Diego ', 'Guevara Nocua', '3117228661', 'Bogota', 'calle 150 b #115-34 ato 201', NULL, 1),
(1147487751, 'dani.wazkag@gmail.com', 'dani114748', 'cc', 'Daniel Felipe', 'Guasca Garcia', '3046206011', 'Bogota', 'cll 143 n 118-20', NULL, 1),
(1147488145, 'alejandronaranjomacias@gmail.com', 'Alejo2011**', 'cc', 'Alejandro', 'Naranjo Macias', '323 5220430', 'Bogota', 'calle 128 # 119 - 34', NULL, 1),
(1014222672, 'eyepeszea2009@gmail.com', '12341', 'cc', 'Esteban', 'Yepes Zea', '3028455445', 'Bogota', 'Cra 128 #144-28', NULL, '1');

INSERT INTO cart (user_id, products) 
VALUES
(1234055, '[{\"id\":\"P001\",\"quantity\":8},{\"id\":\"P002\",\"quantity\":1}]'),
(1011108574, '[{\"id\":\"P001\",\"quantity\":10},{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":2},{\"id\":\"P003\",\"quantity\":2}]'),
(1013271129, '[{\"id\":\"P003\",\"quantity\":1},{\"id\":\"P001\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":1}]'),
(1013271258, '[{\"id\":\"P004\",\"quantity\":1},{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P003\",\"quantity\":1}]'),
(1013695035, '[{\"id\":\"P003\",\"quantity\":1},{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":1}]'),
(1014876898, '[{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P003\",\"quantity\":1},{\"id\":\"P001\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":1}]'),
(1021635609, '[{\"id\":\"P003\",\"quantity\":1},{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P001\",\"quantity\":1}]'),
(1025066385, '[{\"id\":\"P001\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":1},{\"id\":\"P002\",\"quantity\":1}]'),
(1031819676, '[{\"id\":\"P001\",\"quantity\":1},{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":1}]'),
(1031823879, '[{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P003\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":1}]'),
(1032942930, '[{\"id\":\"P002\",\"quantity\":3}]'),
(1117023695, '[{\"id\":\"P001\",\"quantity\":1}]'),
(1121708132, '[{\"id\":\"P002\",\"quantity\":3},{\"id\":\"P003\",\"quantity\":2}]'),
(1127591220, '[{\"id\":\"P001\",\"quantity\":1},{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P003\",\"quantity\":1},{\"id\":\"P004\",\"quantity\":1}]'),
(1147488145, '[{\"id\":\"P002\",\"quantity\":1},{\"id\":\"P001\",\"quantity\":1}]'),
(1014222672, '[{\"id\":\"P001\",\"quantity\":3}]');