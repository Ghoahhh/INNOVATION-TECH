CREATE DATABASE IF NOT EXISTS innovation_tech;

USE innovation_tech;

CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) DEFAULT 'user'
);

CREATE TABLE inventary (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    stock INT NOT NULL,
    description TEXT,
    img TEXT
);

CREATE TABLE cart (
    user_id VARCHAR(50) PRIMARY KEY,
    products JSON NOT NULL
);

CREATE TABLE orders (
    id VARCHAR(20) PRIMARY KEY, 
    user_id VARCHAR(100) NOT NULL,
    products JSON NOT NULL,
    total INT NOT NULL,
    status VARCHAR(20) DEFAULT 'pendiente'
    date CURRENT_TIMESTAMP
);