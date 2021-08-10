DROP TABLE validade;
DROP TABLE alimento;
DROP TABLE inventario;
DROP TABLE users;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(50) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    tipo varchar(50) NOT NULL,
    PRIMARY KEY (Id)
);

CREATE TABLE inventario (
    id int NOT NULL AUTO_INCREMENT,
    produto varchar(50) UNIQUE NOT NULL,
    estado int(1),
    PRIMARY KEY (Id)
);

CREATE TABLE alimento (
    id int NOT NULL AUTO_INCREMENT,
    inventario_id int,
    peso_produto varchar(50),
    PRIMARY KEY (Id),
    FOREIGN KEY (inventario_id) REFERENCES inventario (id)
);

CREATE TABLE validade (
    id int NOT NULL AUTO_INCREMENT,
    alimento_id int,
    data date,
    quantidade int NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY (alimento_id) REFERENCES alimento (id)
);

INSERT INTO users (nome, password, tipo) VALUES ("Grupo 1", "$2a$10$7SoIHtKRdAV3F39mq9BFn.HUkGYrwL7dz6HTYFHVfQR1I66CNKkNa", "voluntario");

INSERT INTO inventario (produto, estado) VALUES ("Arroz", 1);
INSERT INTO inventario (produto, estado) VALUES ("Esparguete", 1);
INSERT INTO inventario (produto, estado) VALUES ("Azeite", 1);
INSERT INTO inventario (produto, estado) VALUES ("Oleo", 1);
INSERT INTO inventario (produto, estado) VALUES ("Batatas-Fritas", 1);
INSERT INTO inventario (produto, estado) VALUES ("Massa", 1);
INSERT INTO inventario (produto, estado) VALUES ("Leite", 1);
INSERT INTO inventario (produto, estado) VALUES ("Grão", 1);
INSERT INTO inventario (produto, estado) VALUES ("Feijão", 1);
INSERT INTO inventario (produto, estado) VALUES ("Salsichas", 1);
INSERT INTO inventario (produto, estado) VALUES ("Atum", 1);
INSERT INTO inventario (produto, estado) VALUES ("Cereais", 1);
INSERT INTO inventario (produto, estado) VALUES ("Bolachas", 1);
INSERT INTO inventario (produto, estado) VALUES ("Chocolates", 1);


INSERT INTO alimento (inventario_id, peso_produto) VALUES (1, "1kg");
INSERT INTO alimento (inventario_id, peso_produto) VALUES (1, "500g");