DROP TABLE VALIDADE;
DROP TABLE ALIMENTO;
DROP TABLE INVENTARIO;
DROP TABLE USERS;
DROP TABLE OUTROS;
DROP TABLE HISTORICO;

CREATE TABLE USERS (
    id int NOT NULL AUTO_INCREMENT,
    nome varchar(50) NOT NULL,
    email varchar(50) UNIQUE NOT NULL, 
    password varchar(255) NOT NULL,
    tipo varchar(50) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE INVENTARIO (
    id int NOT NULL AUTO_INCREMENT,
    produto varchar(50) UNIQUE NOT NULL,
    imagem varchar(50) UNIQUE NOT NULL,
    observacoes varchar(255),
    validade int(1) NOT NULL,
    estado int(1) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE ALIMENTO (
    id int NOT NULL AUTO_INCREMENT,
    inventario_id int NOT NULL,
    capacidade varchar(50) NOT NULL,
    PRIMARY KEY (Id),
    FOREIGN KEY (inventario_id) REFERENCES inventario (id)
);

CREATE TABLE VALIDADE (
    id int NOT NULL AUTO_INCREMENT,
    alimento_id int NOT NULL,
    data date,
    quantidade int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (alimento_id) REFERENCES alimento (id)
);

CREATE TABLE OUTROS (
    id int NOT NULL AUTO_INCREMENT,
    produto varchar(50) NOT NULL,
    capacidade varchar(50) NOT NULL,
    data date,
    quantidade int NOT NULL,
    observacoes varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE HISTORICO (
    id int NOT NULL AUTO_INCREMENT,
    data DATETIME NOT NULL,
    nome varchar(255) NOT NULL,
    acao varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO USERS (nome, email, password, tipo) VALUES ('admin', 'admin@admin.pt', '$2a$10$ohUHjwo1Nc9dNkM20Na3nu.fLItq3MaObXuvMrOz9GAJ4Uqfn0fGi', 'admin');
INSERT INTO USERS (nome, email, password, tipo) VALUES ('Grupo 1', 'grupo1@gmail.com', '$2a$10$7SoIHtKRdAV3F39mq9BFn.HUkGYrwL7dz6HTYFHVfQR1I66CNKkNa', 'voluntario');

INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Açucar', 'Açucar.jpg', 'Dicas sobre os alimentos', 0, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Arroz', 'Arroz.jpg', 'Pacotes com capacidades diferentes das capacidades já existentes inventariar como novo produto (ex: 3Kg / 500g). Não esquecer de dar baixa mesmo que o pacote tenha ido para o lixo.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Atum', 'Atum.jpg', 'Latas cuja capacidade não esteja nestes limites deve ser inventariado em separado.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Azeite', 'Azeite.jpg', 'Garrafas com capacidades diferentes das capacidades já existentes, inventariar como novo produto', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Bolachas', 'Bolachas.jpg', 'Não tirar o invólucro que tem a validade, no caso disto acontecer, apontar a validade no pacote. Se aparecer algum pacote sem validade, apontar a validade do dia no pacote. Qualquer outro tipo de bolachas que não seja desta capacidade, inventariar como novo produto.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Cereais', 'Cereais.jpg', '1 pacote = 1 unidade, independentemente da capacidade. Dar os maiores às famílias mais numerosas.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Farinha', 'Farinha.jpg', 'Algum pacote fora da capacidade "normal" apontar como novo alimento.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Farinha Lactea', 'Farinha_Lactea.jpg', '1 pacote = 1 unidade, independentemente da capacidade. Dar os maiores às famílias com mais bebés/ crianças', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Leguminosas Lata', 'Leguminosas_Lata.jpg', 'CONTA O PESO LIQUIDO', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Leguminosas Frasco', 'Leguminosas_Frasco.jpg', 'Algum frasco com capacidade fora do "normal" apontar como novo alimento.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Leguminosas Secas', 'Leguminosas_Secas.jpg', 'Algum pacote com capacidade fora do "normal" apontar como novo alimento.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Leite', 'Leite.jpg', 'Tudo o que for leites sem Lactose e/ou bebidas vegetais inventariar como um produto à parte. Leites de 200ml inventariar à parte também.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Massa Esparguete', 'Esparguete.jpg', 'Algum pacote com capacidade fora do "normal" apontar como novo alimento. Não esquecer de dar baixa mesmo que o pacote tenha ido para o lixo', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Massa', 'Massa.jpg', 'Algum pacote com capacidade fora do "normal" apontar como novo alimento. Não esquecer de dar baixa mesmo que o pacote tenha ido para o lixo', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Oleo', 'Oleo.jpg', 'Alguma garrafa com capacidade fora do "normal" apontar como novo alimento.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Salsichas', 'Salsichas.jpg', 'Frascos ou latas de outra capacidade inventariar como novo alimento.', 1, 1);
INSERT INTO INVENTARIO (produto, imagem, observacoes, validade, estado) VALUES ('Sardinhas/ Cavalas/ Lulas/ Patês', 'Enlatados.jpg', 'Tudo o que for semelhante, mas não seja atum', 1, 1);


INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (1, '1kg');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (2, '1kg');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (3, '100g-120g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (3, '385g-395g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (4, '750ml');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (5, '200g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (6, '300g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (6, '500g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (6, '1kg');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (7, '1kg');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (8, 'Pacote/Unidade');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (9, 'Por definir');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (10, '540g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (11, '500g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (11, '1kg');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (12, '1L');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (13, '500g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (13, '1kg');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (14, '250g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (14, '500g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (15, '1L');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (16, '6-8');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (17, '100g-120g');
INSERT INTO ALIMENTO (inventario_id, capacidade) VALUES (17, '385g-395g');