DROP TABLE validade;
DROP TABLE alimento;
DROP TABLE inventario;
DROP TABLE users;
DROP TABLE outros;

CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(50) NOT NULL,
    email varchar(50) UNIQUE NOT NULL, 
    password varchar(255) NOT NULL,
    tipo varchar(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE inventario (
    id int NOT NULL AUTO_INCREMENT,
    produto varchar(50) UNIQUE NOT NULL,
    imagem varchar(50) UNIQUE NOT NULL,
    observacoes varchar(255),
    validade int(1) NOT NULL,
    estado int(1) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE alimento (
    id int NOT NULL AUTO_INCREMENT,
    inventario_id int NOT NULL,
    capacidade varchar(50) NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY (inventario_id) REFERENCES inventario (id)
);

CREATE TABLE validade (
    id int NOT NULL AUTO_INCREMENT,
    alimento_id int NOT NULL,
    data date,
    quantidade int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (alimento_id) REFERENCES alimento (id)
);

CREATE TABLE outros (
    id int NOT NULL AUTO_INCREMENT,
    produto varchar(50) UNIQUE NOT NULL,
    capacidade varchar(50) NOT NULL,
    data date,
    quantidade int NOT NULL,
    observacoes varchar(255),
    PRIMARY KEY (id)
);

INSERT INTO users (nome, email, password, tipo) VALUES ("admin", "admin@admin.pt", "$2a$10$ohUHjwo1Nc9dNkM20Na3nu.fLItq3MaObXuvMrOz9GAJ4Uqfn0fGi", "admin");
INSERT INTO users (nome, email, password, tipo) VALUES ("Grupo 1", "grupo1@gmail.com", "$2a$10$7SoIHtKRdAV3F39mq9BFn.HUkGYrwL7dz6HTYFHVfQR1I66CNKkNa", "voluntario");

INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Arroz", "Arroz.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Esparguete", "Esparguete.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Azeite", "Azeite.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Oleo", "Oleo.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Batatas Fritas", "Batatas_Fritas.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Massa", "Massa.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leite", "Leite.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leguminosas Frasco", "Leguminosas_Frasco.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leguminosas Lata", "Leguminosas_Lata.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Leguminosas Secas", "Leguminosas_Secas.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Salsichas", "Salsichas.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Atum", "Atum.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Cereais", "Cereais.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Bolachas", "Bolachas.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Farinha", "Farinha.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Farinha Lactea", "Farinha_Lactea.jpg", "Dicas sobre os alimentos", 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ("Açucar", "Açucar.jpg", "Dicas sobre os alimentos", 0, 1);

INSERT INTO alimento (inventario_id, capacidade) VALUES (1, "1kg");
INSERT INTO alimento (inventario_id, capacidade) VALUES (17, "1kg");