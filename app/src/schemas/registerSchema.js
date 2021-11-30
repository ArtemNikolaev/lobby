module.exports = {
  username: (data) => {
    return data.length >= 6;
  },
  email: (data) => {
    const regex =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!data.match(regex);
  },
  password: (data) => {
    return data.length >= 6;
  },
};
