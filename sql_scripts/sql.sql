CREATE TABLE users (
    Id int NOT NULL AUTO_INCREMENT,
    nome varchar(50) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    tipo varchar(50) NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE alimento (
    Id int NOT NULL AUTO_INCREMENT,
    produto varchar(50) UNIQUE NOT NULL,
    estado int(1),
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

INSERT INTO users (nome, password, tipo) VALUES ("Grupo 1", "$2a$10$7SoIHtKRdAV3F39mq9BFn.HUkGYrwL7dz6HTYFHVfQR1I66CNKkNa", "voluntario");

INSERT INTO alimento (produto, estado) VALUES ("Arroz", 1);
INSERT INTO alimento (produto, estado) VALUES ("Esparguete", 0);
INSERT INTO alimento (produto, estado) VALUES ("Azeite", 1);