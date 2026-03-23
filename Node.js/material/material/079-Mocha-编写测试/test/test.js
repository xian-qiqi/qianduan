const sum = require("../sum")
// console.log(sum(1,2,3,4,5))

//
var assert = require("assert")  //进行断言
assert.strictEqual(sum(1),1) //断定sum()结果一定为0
assert.strictEqual(sum(1,2),3)
assert.strictEqual(sum(1,2,3),6)  //能跑通这三个函数就证明 函数sum没问题

//describe  一组测试，嵌套
// it 一个测试

// !在终端输入  npm test 进行测试
describe("大的组1测试", ()=>{
    describe("小的组测试", ()=>{
        it("sum() result is 0", ()=>{
            assert.strictEqual(sum(), 0)
        })
        it("sum(1) result is 1", ()=>{
            assert.strictEqual(sum(1), 1)
        })
    })
})
describe("大的组2测试", ()=>{
    it("sum(1,2,3) result is 6", ()=>{
            assert.strictEqual(sum(1,2,3), 6)
    })
})