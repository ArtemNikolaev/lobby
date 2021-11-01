const util = require("util");
const { randomBytes, scrypt } = require("crypto");

const scryptAsync = util.promisify(scrypt);

async function hash(password, salt) {
  const saltInUse = salt || randomBytes(12).toString("hex");
  const hashBuffer = await scryptAsync(password, saltInUse, 16);

  return `${hashBuffer.toString("hex")}:${saltInUse}`;
}

async function verify(candidateHash, password) {
  const salt = candidateHash.split(":")[1];
  const hashedPassword = await hash(password, salt);

  return candidateHash === hashedPassword;
}

module.exports = { hash, verify };
