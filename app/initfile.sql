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
    PRIMARY KEY(id),
    UNIQUE (title)
);


CREATE TABLE IF NOT EXISTS tables (
    id INT AUTO_INCREMENT,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (game_id) REFERENCES games(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);


INSERT INTO users (
    username, 
    email, 
    password, 
    role
) 
VALUES (
    'Jason Statham', 
    'admin@gmail.com', 
    '86a4f287407159d20efa2e0682f6525c:8fac330a91d8ce4b52196980', 
    'admin'
);


INSERT INTO games (
    title, 
    description, 
    url
) 
VALUES (
    'GTA 6', 
    'The cool game with cars and guns', 
    'src/public/uploads/e28cd1eb-7ba2-4698-a76e-c26584bee1db.jpg'
),
(
    'The Witcher III', 
    'The cool game based on Slavic mythology', 
    'src/public/uploads/f9a34e23-ff7e-49ff-b475-72a640ddd5d3.jpg'
);