// import config from "../../config/config.js";
// import { jumpToStartPage } from "../utils/index.js";

class User {
  //   constructor({ protocol, host, port } = config) {
  //     this.url = `${protocol}://${host}:${port}/api`;
  //     this.jwt = localStorage.getItem("jwt");
  //   }

  async sendData(data, action) {
    return fetch("http://localhost:3000/auth/" + action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  //   async logout(jwt) {
  //     await fetch(this.url + "/auth/logout", {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${jwt}`,
  //       },
  //     });
  //   }
}

export default new User();
