# Lobby

### Description

A simple application that contains registration, game selection and the ability to see the created games and connect to them

1. Registration - the user can register, log in, log out. Each user must create a unique nickname for the system. You can login by this nickname or by email
2. After entering the system, the user sees different rooms (lobby) depending on the game. Choosing a game, he gets into the lobby of this game
3. The lobby contains information about the created tables, has functionality for connecting to the table
4. You can create a table with a password and only comrades who know the password can enter it
5. Inside the table, a simple chat functionality must be implemented (you can send general or individual messages)

### RUN

1. Use `.env.sample` file.
2. Open your terminal in the root directory:

```sh
npm i

docker-compose up -d
```

3. Click http://localhost:3000

4. Admin creds: login - `admin`/`admin@gmail.com`, password - `123123`
