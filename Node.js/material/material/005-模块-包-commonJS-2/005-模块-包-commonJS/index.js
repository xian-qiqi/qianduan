var Modulea = require('./a')
var Moduleb = require('./b')
var Modulec = require('./c')

console.log(Modulea)
console.log(Moduleb)
console.log(Modulec)

Modulea.test()
console.log(Modulea.upper('jiujiu'))
// Modulea._init()  不能使用，没有暴露
Moduleb()
Modulec()