DROP TABLE validade;
DROP TABLE alimento;
DROP TABLE inventario;
DROP TABLE users;
DROP TABLE outros;
DROP TABLE historico;

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
    observacoes varchar(500),
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
    produto varchar(50) NOT NULL,
    capacidade varchar(50) NOT NULL,
    data date,
    quantidade int NOT NULL,
    observacoes varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE historico (
    id int NOT NULL AUTO_INCREMENT,
    data DATETIME NOT NULL,
    nome varchar(255) NOT NULL,
    acao varchar(255) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO users (nome, email, password, tipo) VALUES ('admin', 'sobreda@diocese.setubal.pt', '$2a$10$MImNYEhCRGVrSWWVp9DMtOL5m5XCDScsrA1zVkeMpDKC72V95VXzy', 'admin');

INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Açucar', 'Açucar.jpg', 'Dicas sobre os alimentos', 0, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Arroz', 'Arroz.jpg', 'Pacotes com capacidades diferentes das capacidades já existentes inventariar como novo produto (ex: 3Kg / 500g). Não esquecer de dar baixa mesmo que o pacote tenha ido para o lixo.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Atum', 'Atum.jpg', 'Latas cuja capacidade não esteja nestes limites deve ser inventariado em separado.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Azeite', 'Azeite.jpg', 'Garrafas com capacidades diferentes das capacidades já existentes, inventariar como novo produto', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Bolachas', 'Bolachas.jpg', 'Não tirar o invólucro que tem a validade, no caso disto acontecer, apontar a validade no pacote. Se aparecer algum pacote sem validade, apontar a validade do dia no pacote. Qualquer outro tipo de bolachas que não seja desta capacidade, inventariar como novo produto.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Cereais', 'Cereais.jpg', '1 pacote = 1 unidade, independentemente da capacidade. Dar os maiores às famílias mais numerosas.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Farinha', 'Farinha.jpg', 'Algum pacote fora da capacidade "normal" apontar como novo alimento.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Farinha Lactea', 'Farinha_Lactea.jpg', '1 pacote = 1 unidade, independentemente da capacidade. Dar os maiores às famílias com mais bebés/ crianças', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Leguminosas Lata', 'Leguminosas_Lata.jpg', 'CONTA O PESO LIQUIDO', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Leguminosas Frasco', 'Leguminosas_Frasco.jpg', 'Algum frasco com capacidade fora do "normal" apontar como novo alimento.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Leguminosas Secas', 'Leguminosas_Secas.jpg', 'Algum pacote com capacidade fora do "normal" apontar como novo alimento.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Leite', 'Leite.jpg', 'Tudo o que for leites sem Lactose e/ou bebidas vegetais inventariar como um produto à parte. Leites de 200ml inventariar à parte também.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Massa Esparguete', 'Esparguete.jpg', 'Algum pacote com capacidade fora do "normal" apontar como novo alimento. Não esquecer de dar baixa mesmo que o pacote tenha ido para o lixo', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Massa', 'Massa.jpg', 'Algum pacote com capacidade fora do "normal" apontar como novo alimento. Não esquecer de dar baixa mesmo que o pacote tenha ido para o lixo', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Oleo', 'Oleo.jpg', 'Alguma garrafa com capacidade fora do "normal" apontar como novo alimento.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Salsichas', 'Salsichas.jpg', 'Frascos ou latas de outra capacidade inventariar como novo alimento.', 1, 1);
INSERT INTO inventario (produto, imagem, observacoes, validade, estado) VALUES ('Sardinhas/ Cavalas/ Lulas/ Patês', 'Enlatados.jpg', 'Tudo o que for semelhante, mas não seja atum', 1, 1);


INSERT INTO alimento (inventario_id, capacidade) VALUES (1, '1kg');
INSERT INTO alimento (inventario_id, capacidade) VALUES (2, '1kg');
INSERT INTO alimento (inventario_id, capacidade) VALUES (3, '100g-120g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (3, '385g-395g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (4, '750ml');
INSERT INTO alimento (inventario_id, capacidade) VALUES (5, '200g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (6, 'Pacote/Unidade');
INSERT INTO alimento (inventario_id, capacidade) VALUES (7, '1kg');
INSERT INTO alimento (inventario_id, capacidade) VALUES (8, 'Pacote/Unidade');
INSERT INTO alimento (inventario_id, capacidade) VALUES (9, 'Por definir');
INSERT INTO alimento (inventario_id, capacidade) VALUES (10, '540g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (11, '500g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (11, '1kg');
INSERT INTO alimento (inventario_id, capacidade) VALUES (12, '1L');
INSERT INTO alimento (inventario_id, capacidade) VALUES (13, '500g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (13, '1kg');
INSERT INTO alimento (inventario_id, capacidade) VALUES (14, '250g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (14, '500g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (15, '1L');
INSERT INTO alimento (inventario_id, capacidade) VALUES (16, '6-8');
INSERT INTO alimento (inventario_id, capacidade) VALUES (17, '100g-120g');
INSERT INTO alimento (inventario_id, capacidade) VALUES (17, '385g-395g');