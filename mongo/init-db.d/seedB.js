db.users.drop();
db.users.createIndex({ username: 1 });
db.users.createIndex({ email: 1 });
db.users.insert({
  username: "Jason Statham",
  email: "admin@gmail.com",
  password: "86a4f287407159d20efa2e0682f6525c:8fac330a91d8ce4b52196980",
  role: "admin",
});
