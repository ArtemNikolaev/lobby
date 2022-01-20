const bluebird = require("bluebird");
const redis = require("redis");

bluebird.promisifyAll(redis.RedisClient.prototype);

module.exports = redis;
