/*
 * @作者: kerwin
 * @公众号: 大前端私房菜
 */
var axios = require("axios")
var assert = require("assert")
var supertest = require("supertest")
var app = require("../app")
describe("测试接口1", () => {   // !没报错，不应该啊，因为错了才对
  it("返回html将代码片段测试", async () => {
    //axios
    var res = await axios.get("http://localhost:3000/")
    assert.strictEqual(res.data, "<h1>hello</h1>")
  })
})

describe("测试接口2", () => {
  let server = app.listen(3000)
  it("返回html将代码片段测试", async () => {
    await supertest(server).get("/")
      .expect("Content-Type", /text\/html/)
      .expect(200, "<h1>hello</h1>")
  })

  after(() => {
    server.close()
  })
})