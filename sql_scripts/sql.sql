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

INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Arroz", "Arroz", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Esparguete", "Esparguete", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Azeite", "Azeite", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Oleo", "Oleo", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Batatas Fritas", "Batatas_Fritas", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Massa", "Massa", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Leite", "Leite", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Leguminosas Frasco", "Leguminosas_Frasco", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Leguminosas Lata", "Leguminosas_Lata", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Leguminosas Secas", "Leguminosas_Secas", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Salsichas", "Salsichas", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Atum", "Atum", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Cereais", "Cereais", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Bolachas", "Bolachas", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Farinha", "Farinha", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Farinha Lactea", "Farinha_Lactea", "Dicas sobre os alimentos", 1);
INSERT INTO inventario (produto, imagem, observacoes, estado) VALUES ("Açucar", "Açucar", "Dicas sobre os alimentos", 1);

INSERT INTO alimento (inventario_id, peso_produto) VALUES (1, "1kg");
INSERT INTO alimento (inventario_id, peso_produto) VALUES (1, "500g");