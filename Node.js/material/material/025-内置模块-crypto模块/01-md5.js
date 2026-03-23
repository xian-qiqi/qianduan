/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
const crypto = require("crypto")

// ?按照md5对数据进行签名,对数据进行加密
// const hash = crypto.createHash("sha1")
const hash = crypto.createHash("md5")

hash.update("123456")
// hash.update("adwadwadwa")

console.log(hash.digest("hex")) // ?按十六进制进行展示