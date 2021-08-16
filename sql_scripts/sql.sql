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
    imagem varchar(50) NOT NULL,
    observacoes varchar(255),
    validade int(1),
    estado int(1),
    PRIMARY KEY (Id)
);

CREATE TABLE alimento (
    id int NOT NULL AUTO_INCREMENT,
    inventario_id int,
    capacidade varchar(50),
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

INSERT INTO users (nome, password, tipo) VALUES ("admin", "$2a$10$ohUHjwo1Nc9dNkM20Na3nu.fLItq3MaObXuvMrOz9GAJ4Uqfn0fGi", "admin");
INSERT INTO users (nome, password, tipo) VALUES ("Grupo 1", "$2a$10$7SoIHtKRdAV3F39mq9BFn.HUkGYrwL7dz6HTYFHVfQR1I66CNKkNa", "voluntario");

INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Arroz", "Arroz", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Esparguete", "Esparguete", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Azeite", "Azeite", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Oleo", "Oleo", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Batatas Fritas", "Batatas_Fritas", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Massa", "Massa", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leite", "Leite", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leguminosas Frasco", "Leguminosas_Frasco", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leguminosas Lata", "Leguminosas_Lata", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leguminosas Secas", "Leguminosas_Secas", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Salsichas", "Salsichas", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Atum", "Atum", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Cereais", "Cereais", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Bolachas", "Bolachas", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Farinha", "Farinha", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Farinha Lactea", "Farinha_Lactea", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Açucar", "Açucar", "Dicas sobre os alimentos", 0, 1);

INSERT INTO alimento (inventario_id, capacidade) VALUES (1, "1kg");
INSERT INTO alimento (inventario_id, capacidade) VALUES (17, "1kg");