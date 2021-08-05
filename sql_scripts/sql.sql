CREATE TABLE users (
    Id int NOT NULL AUTO_INCREMENT,
    nome varchar(50) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    tipo varchar(50) NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE alimento (
    Id int NOT NULL AUTO_INCREMENT,
    Produto varchar(50) UNIQUE NOT NULL,
    Estado int(1)
    PRIMARY KEY (Id)
);

CREATE TABLE inventario (
    Id int NOT NULL AUTO_INCREMENT,
    alimento_id int,
    peso_produto int,
    PRIMARY KEY (Id),
    FOREIGN KEY (alimento_id) REFERENCES alimento (id)
);

CREATE TABLE validade (
    Id int NOT NULL AUTO_INCREMENT,
    inventario_id int,
    data date,
    quantidade int NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY (inventario_id) REFERENCES inventario (id)
);