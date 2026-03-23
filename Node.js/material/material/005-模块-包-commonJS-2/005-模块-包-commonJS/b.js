function test(){
    console.log('test-bbb')
}

//将方法暴露出去
module.exports = test

//导入a
var Modulea = require('./a')
// 使用a方法
console.log(Modulea.upper('yingxiao'))