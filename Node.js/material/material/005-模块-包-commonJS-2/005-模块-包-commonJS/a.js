function test(){
    console.log('test-aaa')
}

//将方法暴露出去
// module.exports = test

function upper(str){
    return str.substring(0,1).toUpperCase() + str.substring(1)
}
function _init(){
    console.log('init')
}

//暴露多个方法
// module.exports = {
//     test: test,
//     upper: upper
// }

exports.test = test
exports.upper = upper
