/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const crypto = require("crypto")

// const hash = crypto.createHash("sha1","kerwin")
// const hash = crypto.createHash("md5","kerwin")
const hash = crypto.createHmac("sha256","kerwin")  // ?"kerwin"为密钥

hash.update("123456")
// hash.update("adwadwadwa")

console.log(hash.digest("hex"))