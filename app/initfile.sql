DROP TABLE IF EXISTS users, games;


CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM ('user','admin') DEFAULT ('user') NOT NULL,
    PRIMARY KEY(id)
);
CREATE INDEX email_index ON users(email);
CREATE INDEX username_index ON users(username);
CREATE INDEX role_index ON users(role);


CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    PRIMARY KEY(id)
);
CREATE INDEX title_index ON games(title);


INSERT INTO users (
    username, 
    email, 
    password, 
    role
) 
VALUES (
    'adminosaurus', 
    'admin@gmail.com', 
    '86a4f287407159d20efa2e0682f6525c:8fac330a91d8ce4b52196980', 
    'admin'
);