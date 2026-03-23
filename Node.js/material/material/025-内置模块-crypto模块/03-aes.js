
// !ASE对称加密算法
// ?加密方法
const crypto = require("crypto")

function encrypt(key,iv,data){
    // "aes-128-cbc"加密方法,密钥长度128位
    let dep = crypto.createCipheriv("aes-128-cbc",key,iv)  

    //  data原始数据，输入数据编码格式binary二进制格式  输出数据编码格式hex十六进制格式
    return dep.update(data,'binary','hex') + dep.final("hex")
}

// ?解密方法
function decrypt(key,iv,crypted){
    // 将十六进制字符串转换为Buffer对象，将Buffer对象转换为二进制字符串
    crypted = Buffer.from(crypted,"hex").toString("binary")

    let dep = crypto.createDecipheriv("aes-128-cbc",key,iv)
    return dep.update(crypted,'binary','utf8')+dep.final("utf8")
}
//16*8 = 128
let key = "abcdef1234567890"    // 16字节密钥,16进制（8位），需要128位，则有16个数字
let iv = "tbcdey1234567890"     // 16字节初始化向量，增加随机性，防止相同明文产生相同密文

let data = "aaaa-kerwin"

let cryted = encrypt(key,iv,data)
console.log("加密结果-",cryted)

let decrypted = decrypt(key,iv,cryted)
console.log("解密结果-",decrypted)